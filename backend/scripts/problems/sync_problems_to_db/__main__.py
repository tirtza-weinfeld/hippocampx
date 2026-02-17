#!/usr/bin/env python3

"""
Sync problem metadata from backend/algorithms/problems/ to PostgreSQL database.

Reads from Python files and extracted JSON metadata to populate:
1. problems table: Problem metadata from __init__.py
2. solutions table: Code + analysis from *.py files
3. symbols table: Tooltip content from symbol_tags + comments
4. lsp table: Positional data from uses, expressions, comments, lsp_index

Supports incremental sync — only processes problems whose files changed since
the last successful run. Use --force to bypass and do a full sync.
"""

import sys
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path

# Add package directory to path for sibling imports
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent.parent))

from db import get_db_connection
from sync import sync_problem_to_db

LAST_SYNC_FILE = Path(__file__).parent / '.last_sync'
METADATA_JSONS = [
    'symbol_tags.json', 'uses.json', 'expressions.json',
    'comments-inline.json', 'comments-inline-symbols.json', 'lsp_index.json',
]


def load_json(path: Path) -> dict:
    """Load a JSON file, returning empty dict if not found."""
    if not path.exists():
        print(f"  ⚠️  JSON not found: {path}")
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def read_last_sync() -> float:
    """Read last sync timestamp, returning 0.0 (epoch) if missing."""
    if not LAST_SYNC_FILE.exists():
        return 0.0
    try:
        text = LAST_SYNC_FILE.read_text().strip()
        dt = datetime.fromisoformat(text)
        return dt.timestamp()
    except (ValueError, OSError):
        return 0.0


def write_last_sync(ts: datetime):
    """Write sync timestamp to .last_sync file."""
    LAST_SYNC_FILE.write_text(ts.isoformat())


def any_metadata_changed(metadata_dir: Path, last_sync_ts: float) -> bool:
    """Check if any metadata JSON has been modified since last sync."""
    for name in METADATA_JSONS:
        path = metadata_dir / name
        if path.exists() and path.stat().st_mtime > last_sync_ts:
            return True
    return False


def problem_files_changed(problem_dir: Path, last_sync_ts: float) -> bool:
    """Check if any .py file in a problem directory changed since last sync."""
    for py_file in problem_dir.glob('*.py'):
        if py_file.stat().st_mtime > last_sync_ts:
            return True
    return False


def get_db_slugs(conn) -> set[str]:
    """Get all problem slugs currently in the database."""
    cursor = conn.cursor()
    cursor.execute("SELECT slug FROM problems")
    return {row[0] for row in cursor.fetchall()}


def delete_removed_problems(conn, slugs_to_delete: set[str]) -> int:
    """Delete problems whose directories no longer exist on disk."""
    if not slugs_to_delete:
        return 0
    cursor = conn.cursor()
    for slug in slugs_to_delete:
        cursor.execute("DELETE FROM problems WHERE slug = %s", (slug,))
        print(f"  🗑️  Deleted {slug} from DB")
    conn.commit()
    return len(slugs_to_delete)


def main():
    """Main sync function."""
    parser = argparse.ArgumentParser(description='Sync problem metadata to PostgreSQL database')
    parser.add_argument('problem_slug', nargs='?',
                        help='Specific problem slug to sync (e.g., "53-maximum-subarray"). If not provided, syncs all problems.')
    parser.add_argument('--force', action='store_true',
                        help='Bypass incremental detection and do a full sync')
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

    # --- Single problem mode (always full sync, no timestamp tracking) ---
    if args.problem_slug:
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

        conn.close()
        return

    # --- All-problems mode with incremental detection ---
    sync_start = datetime.now(timezone.utc)
    last_sync_ts = 0.0 if args.force else read_last_sync()

    if last_sync_ts == 0.0:
        mode = "full (--force)" if args.force else "full (first run)"
    else:
        last_dt = datetime.fromtimestamp(last_sync_ts, tz=timezone.utc)
        mode = f"incremental (since {last_dt.strftime('%Y-%m-%d %H:%M:%S UTC')})"

    print(f"🔄 Syncing all problems — {mode}\n")

    metadata_changed = any_metadata_changed(metadata_dir, last_sync_ts)
    if metadata_changed and last_sync_ts > 0.0:
        print("📋 Metadata JSONs changed — will re-sync symbols/lsp for all problems\n")

    # Gather filesystem slugs and detect changes
    fs_slugs: set[str] = set()
    changed_slugs: set[str] = set()

    for problem_dir in sorted(problems_dir.iterdir()):
        if not problem_dir.is_dir() or problem_dir.name.startswith('.'):
            continue
        slug = problem_dir.name
        fs_slugs.add(slug)

        if last_sync_ts == 0.0 or problem_files_changed(problem_dir, last_sync_ts):
            changed_slugs.add(slug)

    # Deletion detection
    db_slugs = get_db_slugs(conn)
    slugs_to_delete = db_slugs - fs_slugs
    deleted_count = delete_removed_problems(conn, slugs_to_delete)

    # Sync problems
    synced_count = 0
    metadata_only_count = 0
    skipped_count = 0
    error_count = 0

    for problem_dir in sorted(problems_dir.iterdir()):
        if not problem_dir.is_dir() or problem_dir.name.startswith('.'):
            continue

        slug = problem_dir.name

        if slug in changed_slugs:
            # Full sync — problem files changed (or first run)
            try:
                sync_problem_to_db(conn, slug, problem_dir,
                                   symbol_tags, uses, expressions,
                                   comments_inline, comment_symbols, lsp_index)
                synced_count += 1
            except Exception as e:
                conn.rollback()
                print(f"  ❌ Error syncing {slug}: {e}")
                import traceback
                traceback.print_exc()
                error_count += 1
        elif metadata_changed:
            # Only metadata JSONs changed — re-sync symbols/lsp
            try:
                sync_problem_to_db(conn, slug, problem_dir,
                                   symbol_tags, uses, expressions,
                                   comments_inline, comment_symbols, lsp_index,
                                   metadata_only=True)
                metadata_only_count += 1
            except Exception as e:
                conn.rollback()
                print(f"  ❌ Error syncing metadata for {slug}: {e}")
                import traceback
                traceback.print_exc()
                error_count += 1
        else:
            skipped_count += 1

    # Write timestamp only on success
    if error_count == 0:
        write_last_sync(sync_start)

    print(f"\n🎉 Sync complete!")
    print(f"   ✅ Synced: {synced_count}")
    if metadata_only_count > 0:
        print(f"   📋 Metadata-only: {metadata_only_count}")
    print(f"   ⏭️  Skipped: {skipped_count}")
    if deleted_count > 0:
        print(f"   🗑️  Deleted: {deleted_count}")
    if error_count > 0:
        print(f"   ❌ Errors: {error_count}")

    conn.close()


if __name__ == '__main__':
    main()
