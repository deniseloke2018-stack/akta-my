#!/usr/bin/env python3
"""
extract.py — Step 1: Extract raw text from AGC PDF or DOCX files.

Usage:
    python extract.py --input path/to/act.pdf --output raw_texts/act-265.txt
    python extract.py --input path/to/act.docx --output raw_texts/act-265.txt

Dependencies:
    pip install pdfplumber python-docx click
"""

import sys
import re
from pathlib import Path

try:
    import click
    import pdfplumber
    from docx import Document
except ImportError:
    print("Missing dependencies. Run: pip install pdfplumber python-docx click")
    sys.exit(1)


def extract_pdf(path: Path) -> str:
    """Extract text from a PDF, page by page, preserving line breaks."""
    pages = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text(x_tolerance=2, y_tolerance=2)
            if text:
                pages.append(f"<!-- PAGE {i+1} -->\n{text}")
    return "\n\n".join(pages)


def extract_docx(path: Path) -> str:
    """Extract text from a DOCX file, preserving paragraph structure."""
    doc = Document(path)
    lines = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            lines.append(text)
    return "\n".join(lines)


def clean_text(text: str) -> str:
    """Remove headers/footers/page numbers commonly found in AGC publications."""
    # Remove common AGC header patterns
    text = re.sub(r"Laws of Malaysia\s*\n", "", text)
    text = re.sub(r"Act \d+\s*\n", "", text)
    # Remove isolated page numbers
    text = re.sub(r"^\d+\s*$", "", text, flags=re.MULTILINE)
    # Collapse triple+ blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


@click.command()
@click.option("--input", "-i", "input_path", required=True, help="Path to PDF or DOCX file")
@click.option("--output", "-o", "output_path", required=True, help="Output .txt file path")
def main(input_path: str, output_path: str):
    src = Path(input_path)
    dst = Path(output_path)
    dst.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        click.echo(f"Error: File not found: {src}", err=True)
        sys.exit(1)

    ext = src.suffix.lower()
    click.echo(f"Extracting {ext.upper()} → {dst}")

    if ext == ".pdf":
        raw = extract_pdf(src)
    elif ext in (".docx", ".doc"):
        raw = extract_docx(src)
    else:
        click.echo(f"Unsupported file type: {ext}", err=True)
        sys.exit(1)

    cleaned = clean_text(raw)
    dst.write_text(cleaned, encoding="utf-8")
    click.echo(f"✓ Extracted {len(cleaned):,} characters → {dst}")


if __name__ == "__main__":
    main()
