#!/usr/bin/env python3
"""
upload.py — Step 3: Upload parsed JSON to Supabase.

Usage:
    python upload.py --input parsed/act-265.json
    python upload.py --input parsed/  # upload all JSON files in directory

Requires environment variables (or a .env file):
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_KEY=your-service-role-key  (use service role, not anon, for writes)

Dependencies:
    pip install supabase python-dotenv click
"""

import json
import sys
from pathlib import Path

try:
    import click
    from dotenv import load_dotenv
    from supabase import create_client
    import os
except ImportError:
    print("Missing dependencies. Run: pip install supabase python-dotenv click")
    sys.exit(1)

load_dotenv()


def get_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in environment or .env file")
        sys.exit(1)
    return create_client(url, key)


def upsert_act(client, data: dict) -> None:
    """Upsert act, parts, sections, subsections from parsed JSON."""
    act = data["act"]
    parts = data["parts"]
    sections = data["sections"]
    subsections = data["subsections"]

    click.echo(f"  Upserting act: {act['title_en']} ({act['act_number']})")
    client.table("acts").upsert(act).execute()

    if parts:
        click.echo(f"  Upserting {len(parts)} parts…")
        client.table("parts").upsert(parts).execute()

    if sections:
        click.echo(f"  Upserting {len(sections)} sections…")
        # Batch in chunks of 50 to avoid request size limits
        for i in range(0, len(sections), 50):
            client.table("sections").upsert(sections[i:i+50]).execute()

    if subsections:
        click.echo(f"  Upserting {len(subsections)} subsections…")
        for i in range(0, len(subsections), 100):
            client.table("subsections").upsert(subsections[i:i+100]).execute()

    click.echo(f"  ✓ Done: {act['id']}")


@click.command()
@click.option("--input", "-i", "input_path", required=True,
              help="Path to a single JSON file OR a directory of JSON files")
@click.option("--dry-run", is_flag=True, help="Parse and validate without uploading")
def main(input_path: str, dry_run: bool):
    src = Path(input_path)
    files = sorted(src.glob("*.json")) if src.is_dir() else [src]

    if not files:
        click.echo("No JSON files found.", err=True)
        sys.exit(1)

    client = None if dry_run else get_supabase()

    for f in files:
        click.echo(f"\n📄 Processing: {f.name}")
        data = json.loads(f.read_text(encoding="utf-8"))

        if dry_run:
            stats = data.get("stats", {})
            click.echo(f"  [DRY RUN] Would upload: "
                       f"{stats.get('total_parts',0)} parts, "
                       f"{stats.get('total_sections',0)} sections, "
                       f"{stats.get('total_subsections',0)} subsections")
        else:
            upsert_act(client, data)

    click.echo("\n✅ All files processed.")


if __name__ == "__main__":
    main()
