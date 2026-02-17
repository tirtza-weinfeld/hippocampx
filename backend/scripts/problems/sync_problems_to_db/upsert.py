"""Database upsert functions for problems, solutions, symbols, and lsp."""

from extract import extract_difficulty, get_directory_timestamps


def upsert_problem(conn, slug: str, problem_dir, problem_metadata: dict) -> str:
    """Insert or update a problem and return its UUID."""
    cursor = conn.cursor()

    # Generate title if not provided
    title = problem_metadata.get('title')
    if not title:
        title = ' '.join(word.capitalize() for word in slug.split('-')[1:])

    # Get timestamps
    timestamps = get_directory_timestamps(problem_dir)
    created_at = timestamps['created_at']
    updated_at = timestamps['updated_at']

    # Topics
    topics = problem_metadata.get('topics', [])

    # Upsert problem
    cursor.execute("""
        INSERT INTO problems (slug, title, definition, leetcode_url, difficulty, topics, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug)
        DO UPDATE SET
            title = EXCLUDED.title,
            definition = EXCLUDED.definition,
            leetcode_url = EXCLUDED.leetcode_url,
            difficulty = EXCLUDED.difficulty,
            topics = EXCLUDED.topics,
            updated_at = EXCLUDED.updated_at
        RETURNING id
    """, (
        slug,
        title,
        problem_metadata.get('definition'),
        problem_metadata.get('leetcode'),
        extract_difficulty(problem_metadata.get('difficulty')),
        topics,
        created_at,
        updated_at
    ))

    problem_id = cursor.fetchone()[0]
    conn.commit()

    return problem_id


def upsert_solution(conn, problem_id: str, file_name: str, solution_data: dict, order_index: int) -> str:
    """Insert or update a solution and return its UUID."""
    cursor = conn.cursor()

    # Upsert solution
    cursor.execute("""
        INSERT INTO solutions (problem_id, file_name, code, intuition, time_complexity, order_index)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (problem_id, file_name)
        DO UPDATE SET
            code = EXCLUDED.code,
            intuition = EXCLUDED.intuition,
            time_complexity = EXCLUDED.time_complexity,
            order_index = EXCLUDED.order_index,
            updated_at = NOW()
        RETURNING id
    """, (
        problem_id,
        file_name,
        solution_data.get('code', ''),
        solution_data.get('intuition'),
        solution_data.get('time_complexity'),
        order_index
    ))

    solution_id = cursor.fetchone()[0]
    conn.commit()

    return solution_id


def sync_symbols(conn, solution_id: str, file_key: str, symbol_tags: dict, comment_symbols: dict):
    """Insert symbols rows for a solution from symbol_tags and comment data.

    Args:
        solution_id: UUID of the solution
        file_key: File path key like 'problems/53-maximum-subarray/solution.py'
        symbol_tags: Full symbol_tags.json dict
        comment_symbols: Full comments-inline-symbols.json dict
    """
    cursor = conn.cursor()

    # Delete existing symbols for this solution
    cursor.execute("DELETE FROM symbols WHERE solution_id = %s", (solution_id,))

    # Build module prefix from file_key: problems/53-maximum-subarray/solution.py → problems.53-maximum-subarray.solution:
    stem = file_key.rsplit('.py', 1)[0]  # problems/53-maximum-subarray/solution
    module_prefix = stem.replace('/', '.') + ':'  # problems.53-maximum-subarray.solution:

    # Insert symbols from symbol_tags that belong to this file
    rows = []
    for qname, tag in symbol_tags.items():
        if not qname.startswith(module_prefix):
            continue
        kind = tag.get('kind', 'variable')
        summary = tag.get('summary') or None
        rows.append((qname, solution_id, kind, summary))

    # Insert comment symbols that belong to this file
    for qname, text in comment_symbols.items():
        if not qname.startswith(file_key + ':comment-line:'):
            continue
        rows.append((qname, solution_id, 'comment', text))

    if rows:
        from psycopg2.extras import execute_values
        execute_values(cursor, """
            INSERT INTO symbols (qname, solution_id, kind, summary)
            VALUES %s
            ON CONFLICT (qname) DO UPDATE SET
                solution_id = EXCLUDED.solution_id,
                kind = EXCLUDED.kind,
                summary = EXCLUDED.summary
        """, rows)

    inserted_qnames = {r[0] for r in rows}
    conn.commit()
    return inserted_qnames


def sync_lsp(conn, solution_id: str, file_key: str,
             uses: dict, expressions: dict, comments_inline: dict,
             lsp_index: dict, valid_qnames: set[str]):
    """Insert lsp rows for a solution from position data.

    Only inserts rows whose qname exists in valid_qnames (symbols table).

    Args:
        solution_id: UUID of the solution
        file_key: File path key like 'problems/53-maximum-subarray/solution.py'
        uses: Full uses.json dict
        expressions: Full expressions.json dict
        comments_inline: Full comments-inline.json dict
        lsp_index: Full lsp_index.json dict
        valid_qnames: Set of qnames that exist in the symbols table
    """
    cursor = conn.cursor()

    # Delete existing lsp rows for this solution
    cursor.execute("DELETE FROM lsp WHERE solution_id = %s", (solution_id,))

    rows = []

    # References from uses.json
    for entry in uses.get(file_key, []):
        nr = entry.get('nameRange') or entry.get('range')
        rows.append((
            solution_id,
            entry['qname'],
            'reference',
            nr['start']['line'],
            nr['start']['character'],
            nr['end']['line'],
            nr['end']['character'],
        ))

    # References from expressions.json
    for entry in expressions.get(file_key, []):
        nr = entry.get('nameRange') or entry.get('range')
        rows.append((
            solution_id,
            entry['qname'],
            'reference',
            nr['start']['line'],
            nr['start']['character'],
            nr['end']['line'],
            nr['end']['character'],
        ))

    # References from comments-inline.json — one reference per comment line
    for line_num in comments_inline.get(file_key, []):
        qname = f"{file_key}:comment-line:{line_num}"
        rows.append((
            solution_id,
            qname,
            'reference',
            line_num, 0,
            line_num, 0,
        ))

    # Definitions from lsp_index.json
    for doc in lsp_index.get('documents', []):
        if doc['uri'] != file_key:
            continue
        _collect_definitions(rows, solution_id, file_key, doc.get('symbols', []))

    # Filter to only rows whose qname exists in the symbols table
    rows = [r for r in rows if r[1] in valid_qnames]

    if rows:
        from psycopg2.extras import execute_values
        execute_values(cursor, """
            INSERT INTO lsp (solution_id, qname, type, start_line, start_char, end_line, end_char)
            VALUES %s
        """, rows)

    conn.commit()
    return len(rows)


def _collect_definitions(rows: list, solution_id: str, file_key: str, symbols: list):
    """Recursively collect definition rows from lsp_index symbol tree."""
    stem = file_key.rsplit('.py', 1)[0]
    module_prefix = stem.replace('/', '.')

    for sym in symbols:
        name = sym['name']
        r = sym['range']
        # Build qname — for top-level symbols: module:name
        # The lsp_index doesn't store qnames, so we need to reconstruct
        # We'll use the nameRange to find the symbol in the tree
        # For now, construct from module path + name
        qname = f"{module_prefix}:{name}"

        rows.append((
            solution_id,
            qname,
            'definition',
            r['start']['line'],
            r['start']['character'],
            r['end']['line'],
            r['end']['character'],
        ))

        # Recurse into children with parent qname
        for child in sym.get('children', []):
            child_qname = f"{module_prefix}:{name}.{child['name']}"
            cr = child['range']
            rows.append((
                solution_id,
                child_qname,
                'definition',
                cr['start']['line'],
                cr['start']['character'],
                cr['end']['line'],
                cr['end']['character'],
            ))
            # lsp_index only nests 2 levels deep (function > inner function)
            for grandchild in child.get('children', []):
                gc_qname = f"{module_prefix}:{name}.{child['name']}.{grandchild['name']}"
                gr = grandchild['range']
                rows.append((
                    solution_id,
                    gc_qname,
                    'definition',
                    gr['start']['line'],
                    gr['start']['character'],
                    gr['end']['line'],
                    gr['end']['character'],
                ))
