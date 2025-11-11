#!/usr/bin/env python3

"""
Sync problem metadata from backend/algorithms/problems/ to PostgreSQL database.

Reads directly from Python files (not JSON) and extracts:
- Problem metadata from __init__.py docstrings
- Solution code and metadata from *.py files

Schema:
1. problems table: Problem metadata from __init__.py
2. solutions table: Code + analysis from *.py files
"""

import os
import sys
import ast
import json
from pathlib import Path
from datetime import datetime
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# Load environment variables from .env.local in project root
env_path = Path(__file__).parent.parent.parent.parent / '.env.local'
load_dotenv(env_path)

# Import code cleaner
sys.path.append(str(Path(__file__).parent))
from code_cleaner import clean_code


def get_db_connection():
    """Get PostgreSQL connection from environment variables."""
    database_url = os.getenv('POSTGRES_URL')

    if not database_url:
        raise ValueError("POSTGRES_URL environment variable not set in .env.local")

    return psycopg2.connect(database_url)


def parse_simple_docstring(docstring: str, expected_sections: list[str]) -> dict[str, str]:
    """Parse simplified docstring format extracting sections."""
    if not docstring:
        return {}

    result = {}
    lines = docstring.strip().splitlines()
    current_section = None
    current_content = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_section and current_content:
                current_content.append("")
            continue

        # Check if this line starts a new section
        section_found = False
        for section in expected_sections:
            if stripped.lower().startswith(f"{section.lower()}:"):
                # Save previous section
                if current_section and current_content:
                    result[current_section.lower().replace(' ', '_')] = '\n'.join(current_content).strip()

                # Start new section
                current_section = section
                current_content = []

                # Check if value is on the same line
                value_part = stripped[len(f"{section}:"):].strip()
                if value_part:
                    current_content.append(value_part)

                section_found = True
                break

        if not section_found and current_section:
            current_content.append(stripped)

    # Save last section
    if current_section and current_content:
        result[current_section.lower().replace(' ', '_')] = '\n'.join(current_content).strip()

    return result


def extract_problem_from_init(init_file: Path) -> dict:
    """Extract problem metadata from __init__.py docstring."""
    try:
        with open(init_file, 'r', encoding='utf-8') as f:
            content = f.read()

        tree = ast.parse(content)
        docstring = ast.get_docstring(tree, clean=True)
        if not docstring:
            return {}

        expected_sections = ['Title', 'Definition', 'Leetcode', 'Difficulty', 'Topics', 'Group']
        metadata = parse_simple_docstring(docstring, expected_sections)

        # Parse topics list
        if 'topics' in metadata:
            topics_str = metadata['topics']
            if topics_str.startswith('[') and topics_str.endswith(']'):
                topics_str = topics_str[1:-1].strip()
                if topics_str:
                    metadata['topics'] = [t.strip() for t in topics_str.split(',')]
            else:
                metadata['topics'] = [t.strip() for t in topics_str.split(',')]

        # Remove 'group' since we're not storing it in DB
        if 'group' in metadata:
            del metadata['group']

        return metadata

    except Exception as e:
        print(f"Error parsing {init_file}: {e}")
        return {}


def extract_solution_from_file(py_file: Path) -> dict:
    """Extract solution code and metadata from a .py file."""
    try:
        with open(py_file, 'r', encoding='utf-8') as f:
            content = f.read()

        tree = ast.parse(content)

        # Find first function
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                docstring = ast.get_docstring(node, clean=True) or ""

                # Clean code (remove docstrings)
                code = clean_code(content)

                # Parse docstring
                expected_sections = ['Intuition', 'Time Complexity', 'Args', 'Variables', 'Expressions', 'Returns']
                result = parse_simple_docstring(docstring, expected_sections)
                result['code'] = code

                # Parse args to dict
                if 'args' in result:
                    args_dict = {}
                    for line in result['args'].split('\n'):
                        line = line.strip()
                        if ':' in line and not line.startswith('`'):
                            param_name = line.split(':')[0].strip()
                            description = ':'.join(line.split(':')[1:]).strip()
                            args_dict[param_name] = description
                    if args_dict:
                        result['args'] = args_dict

                # Parse variables to dict
                if 'variables' in result:
                    variables_dict = {}
                    for line in result['variables'].split('\n'):
                        line = line.strip()
                        if ':' in line:
                            var_name = line.split(':')[0].strip()
                            description = ':'.join(line.split(':')[1:]).strip()
                            # Remove quotes
                            if var_name.startswith("'") and var_name.endswith("'"):
                                var_name = var_name[1:-1]
                            elif var_name.startswith('"') and var_name.endswith('"'):
                                var_name = var_name[1:-1]
                            variables_dict[var_name] = description
                    if variables_dict:
                        result['variables'] = variables_dict

                # Parse expressions to dict (simplified - just key:value)
                if 'expressions' in result:
                    expressions_dict = {}
                    for line in result['expressions'].split('\n'):
                        line = line.strip()
                        if ':' in line:
                            # Handle quoted expressions
                            if line.startswith("'") and "': " in line:
                                quote_end = line.find("': ", 1)
                                if quote_end != -1:
                                    expr_name = line[1:quote_end]
                                    description = line[quote_end + 3:]
                                    expressions_dict[expr_name] = description
                            else:
                                expr_name = line.split(':')[0].strip()
                                description = ':'.join(line.split(':')[1:]).strip()
                                # Remove quotes
                                if expr_name.startswith("'") and expr_name.endswith("'"):
                                    expr_name = expr_name[1:-1]
                                elif expr_name.startswith('"') and expr_name.endswith('"'):
                                    expr_name = expr_name[1:-1]
                                expressions_dict[expr_name] = description
                    if expressions_dict:
                        result['expressions'] = expressions_dict

                return result

        # No function found - still clean the code
        return {'code': clean_code(content)}

    except Exception as e:
        print(f"Error parsing {py_file}: {e}")
        return {}


def extract_difficulty(difficulty: str | None) -> str:
    """Extract and normalize difficulty level."""
    if not difficulty:
        return 'medium'

    normalized = difficulty.strip().split()[0].lower()
    if normalized in ['easy', 'medium', 'hard']:
        return normalized
    return 'medium'


def get_directory_timestamps(directory: Path) -> dict:
    """Get created/updated timestamps for directory."""
    stat = directory.stat()
    return {
        'created_at': datetime.fromtimestamp(stat.st_birthtime).isoformat(),
        'updated_at': datetime.fromtimestamp(stat.st_mtime).isoformat()
    }


def upsert_problem(conn, slug: str, problem_dir: Path, problem_metadata: dict) -> str:
    """Insert or update a problem and return its UUID."""
    cursor = conn.cursor()

    # Extract number from slug
    number = None
    if slug[0].isdigit():
        number_str = slug.split('-')[0]
        if number_str.isdigit():
            number = int(number_str)

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

    # Convert dicts to JSON for PostgreSQL
    args = psycopg2.extras.Json(solution_data.get('args')) if solution_data.get('args') else None
    variables = psycopg2.extras.Json(solution_data.get('variables')) if solution_data.get('variables') else None
    expressions = psycopg2.extras.Json(solution_data.get('expressions')) if solution_data.get('expressions') else None

    # Upsert solution
    cursor.execute("""
        INSERT INTO solutions (problem_id, file_name, code, intuition, time_complexity, args, variables, expressions, returns, order_index)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (problem_id, file_name)
        DO UPDATE SET
            code = EXCLUDED.code,
            intuition = EXCLUDED.intuition,
            time_complexity = EXCLUDED.time_complexity,
            args = EXCLUDED.args,
            variables = EXCLUDED.variables,
            expressions = EXCLUDED.expressions,
            returns = EXCLUDED.returns,
            order_index = EXCLUDED.order_index,
            updated_at = NOW()
        RETURNING id
    """, (
        problem_id,
        file_name,
        solution_data.get('code', ''),
        solution_data.get('intuition'),
        solution_data.get('time_complexity'),
        args,
        variables,
        expressions,
        solution_data.get('returns'),
        order_index
    ))

    solution_id = cursor.fetchone()[0]
    conn.commit()

    return solution_id


def sync_problem_to_db(conn, slug: str, problem_dir: Path):
    """Sync a single problem to the database."""
    print(f"Syncing: {slug}")

    # Extract from __init__.py
    init_file = problem_dir / '__init__.py'
    if not init_file.exists():
        print(f"  ⚠️  No __init__.py found for {slug}")
        return

    problem_metadata = extract_problem_from_init(init_file)
    if not problem_metadata:
        print(f"  ⚠️  No metadata found in __init__.py for {slug}")
        return

    # Upsert problem
    problem_id = upsert_problem(conn, slug, problem_dir, problem_metadata)

    # Extract solutions from *.py files
    solution_files = [f for f in problem_dir.glob('*.py')
                      if f.name != '__init__.py' and not f.name.startswith('_')]

    for order_index, py_file in enumerate(sorted(solution_files)):
        solution_data = extract_solution_from_file(py_file)
        if solution_data:
            upsert_solution(conn, problem_id, py_file.name, solution_data, order_index)

    print(f"  ✅ Synced {slug} with {len(solution_files)} solution(s)")


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
