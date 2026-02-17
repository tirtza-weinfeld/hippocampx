"""Orchestrator — syncs a single problem to the database."""

from pathlib import Path

from extract import extract_problem_from_init, extract_solution_from_file
from upsert import upsert_problem, upsert_solution, sync_symbols, sync_lsp


def sync_problem_to_db(conn, slug: str, problem_dir: Path,
                       symbol_tags: dict, uses: dict, expressions: dict,
                       comments_inline: dict, comment_symbols: dict,
                       lsp_index: dict, metadata_only: bool = False):
    """Sync a single problem to the database.

    When metadata_only=True, skip problem/solution upserts and only re-sync
    symbols + lsp data (for when metadata JSONs changed but problem files didn't).
    """
    print(f"Syncing{' (metadata only)' if metadata_only else ''}: {slug}")

    # Extract from __init__.py
    init_file = problem_dir / '__init__.py'
    if not init_file.exists():
        print(f"  ⚠️  No __init__.py found for {slug}")
        return

    problem_metadata = extract_problem_from_init(init_file)
    if not problem_metadata:
        print(f"  ⚠️  No metadata found in __init__.py for {slug}")
        return

    if metadata_only:
        # Only re-sync symbols + lsp — look up existing problem_id and solution_ids
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM problems WHERE slug = %s", (slug,))
        row = cursor.fetchone()
        if not row:
            print(f"  ⚠️  Problem {slug} not in DB, skipping metadata-only sync")
            return
        problem_id = row[0]

        cursor.execute(
            "SELECT id, file_name FROM solutions WHERE problem_id = %s ORDER BY order_index",
            (problem_id,)
        )
        for solution_id, file_name in cursor.fetchall():
            file_key = f"problems/{slug}/{file_name}"
            valid_qnames = sync_symbols(conn, solution_id, file_key, symbol_tags, comment_symbols)
            lsp_count = sync_lsp(conn, solution_id, file_key, uses, expressions, comments_inline, lsp_index, valid_qnames)
            print(f"  📝 {file_name}: {len(valid_qnames)} symbols, {lsp_count} lsp rows")

        conn.commit()
        print(f"  ✅ Synced metadata for {slug}")
        return

    # Full sync: upsert problem
    problem_id = upsert_problem(conn, slug, problem_dir, problem_metadata)

    # Extract solutions from *.py files
    solution_files = [f for f in problem_dir.glob('*.py')
                      if f.name != '__init__.py' and not f.name.startswith('_')]

    for order_index, py_file in enumerate(sorted(solution_files)):
        solution_data = extract_solution_from_file(py_file)
        if solution_data:
            solution_id = upsert_solution(conn, problem_id, py_file.name, solution_data, order_index)

            # Sync symbols and lsp for this solution
            file_key = f"problems/{slug}/{py_file.name}"
            valid_qnames = sync_symbols(conn, solution_id, file_key, symbol_tags, comment_symbols)
            lsp_count = sync_lsp(conn, solution_id, file_key, uses, expressions, comments_inline, lsp_index, valid_qnames)
            print(f"  📝 {py_file.name}: {len(valid_qnames)} symbols, {lsp_count} lsp rows")

    # Delete solutions that no longer exist in the filesystem
    solution_file_names = [f.name for f in solution_files]
    cursor = conn.cursor()
    if solution_file_names:
        cursor.execute("""
            DELETE FROM solutions
            WHERE problem_id = %s AND file_name NOT IN %s
        """, (problem_id, tuple(solution_file_names)))
    else:
        cursor.execute("""
            DELETE FROM solutions
            WHERE problem_id = %s
        """, (problem_id,))
    deleted_count = cursor.rowcount
    conn.commit()

    if deleted_count > 0:
        print(f"  🗑️  Removed {deleted_count} stale solution(s)")

    print(f"  ✅ Synced {slug} with {len(solution_files)} solution(s)")
