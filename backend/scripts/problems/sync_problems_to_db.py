#!/usr/bin/env python3

"""
Sync problem metadata from backend/algorithms/problems/ directly to PostgreSQL database.

New Clean Architecture:
1. problems table: All problem metadata
2. solutions table: Just code for each solution file
3. symbols table: ALL tooltip metadata (args, variables, expressions, functions)

This replaces the old generate-agent-mdx.ts workflow entirely.
"""

import ast
import json
import os
import sys
from pathlib import Path
from datetime import datetime
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Load environment variables from .env.local in project root
env_path = Path(__file__).parent.parent.parent.parent / '.env.local'
load_dotenv(env_path)

# Import existing helper functions
from code_cleaner import clean_code
from get_directory_timestamps import get_directory_timestamps

# Import extraction functions from existing script
sys.path.append(str(Path(__file__).parent))
from extract_problems_metadata import (
    extract_problem_metadata,
    extract_function_metadata,
    parse_simple_docstring,
)


def get_db_connection():
    """Get PostgreSQL connection from environment variables."""
    database_url = os.getenv('POSTGRES_URL')

    if not database_url:
        raise ValueError("POSTGRES_URL environment variable not set in .env.local")

    return psycopg2.connect(database_url)


def extract_difficulty(difficulty: str | None) -> str:
    """Extract and normalize difficulty level."""
    if not difficulty:
        return 'medium'

    normalized = difficulty.strip().split()[0].lower()
    if normalized in ['easy', 'medium', 'hard']:
        return normalized
    return 'medium'


def upsert_problem(conn, slug: str, problem_data: dict) -> str:
    """Insert or update a problem and return its UUID."""
    cursor = conn.cursor()

    # Extract number from slug (e.g., "713-subarray..." -> 713)
    number = None
    if slug[0].isdigit():
        number_str = slug.split('-')[0]
        if number_str.isdigit():
            number = int(number_str)

    # Generate title if not provided
    title = problem_data.get('title')
    if not title:
        title = ' '.join(word.capitalize() for word in slug.split('-')[1:])

    # Extract timestamps
    timestamps = problem_data.get('time_stamps', {})
    created_at = timestamps.get('created_at', datetime.now().isoformat())
    updated_at = timestamps.get('updated_at', datetime.now().isoformat())

    # Convert topics list to PostgreSQL array format
    topics = problem_data.get('topics', [])

    # Upsert problem
    cursor.execute("""
        INSERT INTO problems (slug, number, title, definition, leetcode_url, difficulty, topics, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug)
        DO UPDATE SET
            number = EXCLUDED.number,
            title = EXCLUDED.title,
            definition = EXCLUDED.definition,
            leetcode_url = EXCLUDED.leetcode_url,
            difficulty = EXCLUDED.difficulty,
            topics = EXCLUDED.topics,
            updated_at = EXCLUDED.updated_at
        RETURNING id
    """, (
        slug,
        number,
        title,
        problem_data.get('definition'),
        problem_data.get('leetcode'),
        extract_difficulty(problem_data.get('difficulty')),
        topics,
        created_at,
        updated_at
    ))

    problem_id = cursor.fetchone()[0]
    conn.commit()

    return problem_id


def upsert_solution(conn, problem_id: str, file_name: str, solution_data: dict, order_index: int) -> str:
    """Insert or update a solution (just code) and return its UUID."""
    cursor = conn.cursor()

    # Upsert solution with ONLY code
    cursor.execute("""
        INSERT INTO solutions (problem_id, file_name, code, order_index)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (problem_id, file_name)
        DO UPDATE SET
            code = EXCLUDED.code,
            order_index = EXCLUDED.order_index,
            updated_at = NOW()
        RETURNING id
    """, (
        problem_id,
        file_name,
        solution_data.get('code', ''),
        order_index
    ))

    solution_id = cursor.fetchone()[0]
    conn.commit()

    return solution_id


def sync_symbols_for_solution(conn, solution_id: str, slug: str, file_name: str, solution_data: dict):
    """
    Sync all symbols for a solution to the symbols table.

    Symbol types:
    - function: The main function (with intuition, time_complexity, etc in metadata)
    - parameter: Function arguments
    - variable: Variables inside the function
    - expression: Key expressions/conditions
    """
    cursor = conn.cursor()

    # Delete existing symbols for this solution
    cursor.execute("DELETE FROM symbols WHERE solution_id = %s", (solution_id,))

    symbols_to_insert = []

    # Get problem number from slug (e.g., "1235-max-profit" -> "1235")
    problem_number = slug.split('-')[0] if slug[0].isdigit() else slug

    # Extract base filename without extension (e.g., "top_down.py" -> "top_down")
    file_base = file_name.replace('.py', '')

    # 1. Create function-level symbol (if there's a main function)
    # For now, we'll assume the first function is the main one
    # qname format: "1235:top_down.py:maximum_profit_in_job_scheduling"

    # We need to extract the function name from the code
    function_name = extract_main_function_name(solution_data.get('code', ''))

    if function_name:
        function_qname = f"{problem_number}:{file_name}:{function_name}"

        # Build metadata for function symbol
        function_metadata = {}
        if solution_data.get('intuition'):
            function_metadata['intuition'] = solution_data['intuition']
        if solution_data.get('time_complexity'):
            function_metadata['time_complexity'] = solution_data['time_complexity']
        if solution_data.get('space_complexity'):
            function_metadata['space_complexity'] = solution_data['space_complexity']
        if solution_data.get('returns'):
            function_metadata['returns'] = solution_data['returns']

        symbols_to_insert.append((
            solution_id,
            function_qname,
            'function',
            function_name,
            solution_data.get('intuition'),  # main content
            json.dumps(function_metadata) if function_metadata else None,
            None  # no parent
        ))

        # 2. Add parameter symbols (args)
        if isinstance(solution_data.get('args'), dict):
            for arg_name, arg_description in solution_data['args'].items():
                # Clean up arg_name (remove type annotations if present)
                clean_arg_name = arg_name.split(':')[0].strip()
                arg_qname = f"{problem_number}:{file_name}:{function_name}.{clean_arg_name}"

                symbols_to_insert.append((
                    solution_id,
                    arg_qname,
                    'parameter',
                    clean_arg_name,
                    arg_description,
                    json.dumps({'label': arg_name}),  # preserve full arg signature
                    None  # Could link to function symbol via parent_id
                ))

        # 3. Add variable symbols
        if isinstance(solution_data.get('variables'), dict):
            for var_name, var_description in solution_data['variables'].items():
                var_qname = f"{problem_number}:{file_name}:{function_name}.{var_name}"

                symbols_to_insert.append((
                    solution_id,
                    var_qname,
                    'variable',
                    var_name,
                    var_description,
                    None,
                    None
                ))

        # 4. Add expression symbols
        if isinstance(solution_data.get('expressions'), dict):
            for expr, expr_description in solution_data['expressions'].items():
                expr_qname = f"{problem_number}:{file_name}:{function_name}.{expr}"

                symbols_to_insert.append((
                    solution_id,
                    expr_qname,
                    'expression',
                    expr,
                    expr_description,
                    None,
                    None
                ))

    # Bulk insert all symbols
    if symbols_to_insert:
        execute_values(
            cursor,
            """
            INSERT INTO symbols (solution_id, qname, kind, name, content, metadata, parent_id)
            VALUES %s
            ON CONFLICT (qname) DO UPDATE SET
                content = EXCLUDED.content,
                metadata = EXCLUDED.metadata,
                updated_at = NOW()
            """,
            symbols_to_insert
        )

    conn.commit()


def extract_main_function_name(code: str) -> str | None:
    """Extract the name of the first function definition from Python code."""
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                return node.name
    except:
        pass
    return None


def sync_problem_to_db(conn, slug: str, problem_dir: Path):
    """Sync a single problem to the database."""
    print(f"Syncing: {slug}")

    # Extract problem metadata using existing function
    problem_data = extract_problem_metadata(problem_dir)

    if not problem_data:
        print(f"  ⚠️  No metadata found for {slug}")
        return

    # Upsert problem
    problem_id = upsert_problem(conn, slug, problem_data)

    # Sync solutions and symbols
    solutions = problem_data.get('solutions', {})
    for order_index, (file_name, solution_data) in enumerate(solutions.items()):
        # Upsert solution (code only)
        solution_id = upsert_solution(conn, problem_id, file_name, solution_data, order_index)

        # Sync all symbols for this solution
        sync_symbols_for_solution(conn, solution_id, slug, file_name, solution_data)

    print(f"  ✅ Synced {slug} with {len(solutions)} solution(s)")


def main():
    """Main sync function."""
    print("🔄 Syncing problems to database...\n")

    # Path to problems directory
    problems_dir = Path(__file__).parent.parent.parent / 'algorithms' / 'problems'

    if not problems_dir.exists():
        print(f"❌ Problems directory not found: {problems_dir}")
        sys.exit(1)

    # Connect to database
    try:
        conn = get_db_connection()
        print("✅ Connected to database\n")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)

    # Process each problem directory
    success_count = 0
    error_count = 0

    for problem_dir in sorted(problems_dir.iterdir()):
        if not problem_dir.is_dir() or problem_dir.name.startswith('.'):
            continue

        try:
            sync_problem_to_db(conn, problem_dir.name, problem_dir)
            success_count += 1
        except Exception as e:
            print(f"  ❌ Error syncing {problem_dir.name}: {e}")
            import traceback
            traceback.print_exc()
            error_count += 1

    conn.close()

    print(f"\n🎉 Sync complete!")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")


if __name__ == '__main__':
    main()
