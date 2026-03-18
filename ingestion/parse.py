#!/usr/bin/env python3
"""
parse.py — Step 2: Parse raw extracted text into structured JSON (Acts/Parts/Sections).

The parser uses regex patterns tuned for the AGC's standard formatting.
Output JSON matches the Supabase schema exactly.

Usage:
    python parse.py --input raw_texts/act-265.txt --act-id act-265 \
                    --act-number 265 --title-en "Employment Act 1955" \
                    --title-ms "Akta Pekerjaan 1955" --year 1955 \
                    --category employment --output parsed/act-265.json

Dependencies:
    pip install click
"""

import re
import json
import sys
import uuid
from pathlib import Path
from typing import Optional

try:
    import click
except ImportError:
    print("Missing dependencies. Run: pip install click")
    sys.exit(1)

# ── Regex patterns (tuned for AGC format) ────────────────────────────────────

# Part headers: "PART I", "PART XII", "BAHAGIAN I"
PART_RE = re.compile(
    r"^(?:PART|BAHAGIAN)\s+([IVXLCDM]+)\s*\n([^\n]+)",
    re.MULTILINE,
)

# Section headers: "1.", "60A.", "374." at start of line
# The actual title usually precedes the section number in Malaysian Acts.
SECTION_RE = re.compile(
    r"^([^\n]+)\n(\d+[A-Z]?)\.\s+([^\n]+\n(?:(?!^[^\n]+\n\d+[A-Z]?\.\s|^\bPART\b|^\bBAHAGIAN\b).+\n?)*)",
    re.MULTILINE,
)

# Subsection: "(1)", "(a)", "(i)" at start of line
SUBSECTION_RE = re.compile(
    r"^\(([^)]+)\)\s+(.+?)(?=^\([^)]+\)\s|\Z)",
    re.MULTILINE | re.DOTALL,
)


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9-]", "-", text.lower().strip()).strip("-")


def parse_text(
    raw: str,
    act_id: str,
    act_number: str,
    title_en: str,
    title_ms: str,
    year: int,
    category: str,
) -> dict:
    parts = []
    sections = []
    subsections = []

    # ── Remove Table of Contents to prevent duplicate duplicate section IDs ─────────
    # Usually TOC is between "ARRANGEMENT OF SECTIONS" and the actual Act start
    toc_start = raw.find("ARRANGEMENT OF SECTIONS")
    if toc_start != -1:
        # Find the next occurrence of "LAWS OF MALAYSIA" after TOC starts
        toc_end = raw.find("LAWS OF MALAYSIA", toc_start + 20)
        if toc_end != -1:
            raw = raw[:toc_start] + raw[toc_end:]
        else:
            # Fallback: look for "An Act "
            toc_end = raw.find("An Act ", toc_start + 20)
            if toc_end != -1:
                raw = raw[:toc_start] + raw[toc_end:]

    # ── Parse parts ───────────────────────────────────────────────────────
    part_blocks = list(PART_RE.finditer(raw))
    part_map: dict[int, str] = {}  # char position → part_id

    for i, m in enumerate(part_blocks):
        part_number = m.group(1).strip()
        part_title = m.group(2).strip()
        part_id = f"{act_id}-p{i+1}"
        parts.append({
            "id": part_id,
            "act_id": act_id,
            "part_number": part_number,
            "title_en": part_title,
            "title_ms": None,
            "order_index": i + 1,
        })
        part_map[m.start()] = part_id

    def get_part_id_for_pos(pos: int) -> Optional[str]:
        """Find which part a given text position belongs to."""
        current = None
        for p_pos, p_id in sorted(part_map.items()):
            if p_pos <= pos:
                current = p_id
        return current

    # ── Parse sections ────────────────────────────────────────────────────
    for i, m in enumerate(SECTION_RE.finditer(raw)):
        section_title = m.group(1).strip()
        section_number = m.group(2).strip()
        content = m.group(3).strip()

        # Deduplicate section IDs
        base_section_id = f"{act_id}-s{section_number.lower()}"
        section_id = base_section_id
        counter = 1
        while any(s["id"] == section_id for s in sections):
            section_id = f"{base_section_id}-{counter}"
            counter += 1

        part_id = get_part_id_for_pos(m.start())

        # If it's a completely empty section string (header only), it might be a dangling TOC entry.
        # But we'll keep it just in case, or we can skip if len(content) < 2 and no subsections
        # Actually, let's just proceed as normal since we stripped TOC.

        sections.append({
            "id": section_id,
            "act_id": act_id,
            "part_id": part_id,
            "section_number": section_number,
            "title_en": section_title,
            "content": content,
            "order_index": i + 1,
        })

        # ── Parse subsections ──────────────────────────────────────────────
        for j, sm in enumerate(SUBSECTION_RE.finditer(content)):
            label = f"({sm.group(1)})"
            sub_content = sm.group(2).strip()
            subsections.append({
                "id": f"{section_id}-ss{j+1}",
                "section_id": section_id,
                "label": label,
                "content": sub_content,
                "order_index": j + 1,
            })

    return {
        "act": {
            "id": act_id,
            "act_number": act_number,
            "title_en": title_en,
            "title_ms": title_ms,
            "year": year,
            "category": category,
            "last_updated": "2025-01-01",
            "total_sections": len(sections),
            "is_featured": False,
        },
        "parts": parts,
        "sections": sections,
        "subsections": subsections,
        "stats": {
            "total_parts": len(parts),
            "total_sections": len(sections),
            "total_subsections": len(subsections),
        },
    }


@click.command()
@click.option("--input", "-i", "input_path", required=True)
@click.option("--output", "-o", "output_path", required=True)
@click.option("--act-id", required=True, help='e.g. "act-265"')
@click.option("--act-number", required=True, help='e.g. "265"')
@click.option("--title-en", required=True)
@click.option("--title-ms", required=True)
@click.option("--year", required=True, type=int)
@click.option("--category", default="other",
              type=click.Choice(["constitution","criminal","civil","employment",
                                  "commercial","administrative","family","data-privacy","other"]))
def main(input_path, output_path, act_id, act_number, title_en, title_ms, year, category):
    src = Path(input_path)
    dst = Path(output_path)
    dst.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        click.echo(f"Error: {src} not found", err=True)
        sys.exit(1)

    raw = src.read_text(encoding="utf-8")
    click.echo(f"Parsing {src} ({len(raw):,} chars)…")

    result = parse_text(raw, act_id, act_number, title_en, title_ms, year, category)
    dst.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    stats = result["stats"]
    click.echo(
        f"✓ Parsed → {dst}\n"
        f"  Parts: {stats['total_parts']}, "
        f"Sections: {stats['total_sections']}, "
        f"Subsections: {stats['total_subsections']}"
    )


if __name__ == "__main__":
    main()
