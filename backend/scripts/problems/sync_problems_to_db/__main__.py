#!/usr/bin/env python3

"""
Sync problem metadata from backend/algorithms/problems/ to PostgreSQL database.

Reads from Python files and extracted JSON metadata to populate:
1. problems table: Problem metadata from __init__.py
2. solutions table: Code + analysis from *.py files
3. symbols table: Tooltip content from symbol_tags + comments
4. lsp table: Positional data from uses, expressions, comments, lsp_index
"""

import sys
import json
import argparse
from pathlib import Path

# Add package directory to path for sibling imports
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent.parent))

from db import get_db_connection
from sync import sync_problem_to_db


def load_json(path: Path) -> dict:
    """Load a JSON file, returning empty dict if not found."""
    if not path.exists():
        print(f"  ⚠️  JSON not found: {path}")
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    """Main sync function."""
    parser = argparse.ArgumentParser(description='Sync problem metadata to PostgreSQL database')
    parser.add_argument('problem_slug', nargs='?',
                        help='Specific problem slug to sync (e.g., "53-maximum-subarray"). If not provided, syncs all problems.')
    args = parser.parse_args()

    # Paths
    project_root = Path(__file__).parent.parent.parent.parent.parent
    problems_dir = project_root / 'backend' / 'algorithms' / 'problems'
    metadata_dir = project_root / 'lib' / 'extracted-metadata'

    if not problems_dir.exists():
        print(f"❌ Problems directory not found: {problems_dir}")
        sys.exit(1)

    # Load extracted metadata JSONs (shared across all problems)
    print("📂 Loading extracted metadata...")
    symbol_tags = load_json(metadata_dir / 'symbol_tags.json')
    uses = load_json(metadata_dir / 'uses.json')
    expressions = load_json(metadata_dir / 'expressions.json')
    comments_inline = load_json(metadata_dir / 'comments-inline.json')
    comment_symbols = load_json(metadata_dir / 'comments-inline-symbols.json')
    lsp_index = load_json(metadata_dir / 'lsp_index.json')
    print(f"  ✅ Loaded: {len(symbol_tags)} symbols, {len(uses)} use files, {len(expressions)} expression files\n")

    # Connect to database
    try:
        conn = get_db_connection()
        print("✅ Connected to database\n")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)

    # Determine which problems to sync
    if args.problem_slug:
        # Sync specific problem
        problem_dir = problems_dir / args.problem_slug
        if not problem_dir.exists() or not problem_dir.is_dir():
            print(f"❌ Problem not found: {args.problem_slug}")
            conn.close()
            sys.exit(1)

        print(f"🔄 Syncing single problem: {args.problem_slug}\n")
        try:
            sync_problem_to_db(conn, args.problem_slug, problem_dir,
                               symbol_tags, uses, expressions,
                               comments_inline, comment_symbols, lsp_index)
            print(f"\n🎉 Successfully synced {args.problem_slug}")
        except Exception as e:
            conn.rollback()
            print(f"❌ Error syncing {args.problem_slug}: {e}")
            import traceback
            traceback.print_exc()
            conn.close()
            sys.exit(1)
    else:
        # Sync all problems
        print("🔄 Syncing all problems to database...\n")
        success_count = 0
        error_count = 0

        for problem_dir in sorted(problems_dir.iterdir()):
            if not problem_dir.is_dir() or problem_dir.name.startswith('.'):
                continue

            try:
                sync_problem_to_db(conn, problem_dir.name, problem_dir,
                                   symbol_tags, uses, expressions,
                                   comments_inline, comment_symbols, lsp_index)
                success_count += 1
            except Exception as e:
                conn.rollback()
                print(f"  ❌ Error syncing {problem_dir.name}: {e}")
                import traceback
                traceback.print_exc()
                error_count += 1

        print(f"\n🎉 Sync complete!")
        print(f"   ✅ Success: {success_count}")
        print(f"   ❌ Errors: {error_count}")

    conn.close()


if __name__ == '__main__':
    main()
