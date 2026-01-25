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
import argparse
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
    database_url = os.getenv('NEON_DATABASE_URL')

    if not database_url:
        raise ValueError("NEON_DATABASE_URL environment variable not set in .env.local")

    return psycopg2.connect(database_url)


def _process_section_lines(lines: list[tuple[str, str] | str]) -> str:
    """Process section lines and convert to MDX-ready indentation."""
    if not lines:
        return ""

    processed_lines = []

    # Convert any string entries to tuples for consistency
    normalized_lines = []
    for line in lines:
        if isinstance(line, str):
            if line == "":
                normalized_lines.append(("", ""))
            else:
                normalized_lines.append(("", line))
        else:
            normalized_lines.append(line)

    # Find base indentation (minimum indentation among non-empty lines)
    base_indent = float('inf')
    for indent, content in normalized_lines:
        if content.strip() and indent:
            base_indent = min(base_indent, len(indent))

    if base_indent == float('inf'):
        base_indent = 0

    # Process all lines, mapping to MDX indentation
    for indent, content in normalized_lines:
        if not content.strip():  # Empty line
            processed_lines.append("")
            continue

        # Calculate original indentation level
        original_indent = len(indent) if indent else 0

        # Same-line content (no indent) stays at 0
        if original_indent == 0:
            processed_lines.append(content)
            continue

        # Calculate relative indent from base
        relative_indent = original_indent - base_indent

        # Mapping: preserve relative indentation as-is
        # - Items at base level (relative 0) → 0 spaces
        # - Items one level deeper (relative 4) → 4 spaces
        # - And so on...
        processed_lines.append(' ' * relative_indent + content)

    return '\n'.join(processed_lines).strip()


def parse_simple_docstring(docstring: str, expected_sections: list[str]) -> dict[str, str]:
    """Parse simplified docstring format extracting sections."""
    if not docstring:
        return {}

    result = {}
    lines = docstring.strip().splitlines()
    current_section = None
    current_lines = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_section and current_lines:
                current_lines.append("")
            continue

        # Check if this line starts a new section
        section_found = False
        for section in expected_sections:
            if stripped.lower().startswith(f"{section.lower()}:"):
                # Process previous section if exists
                if current_section and current_lines:
                    processed_content = _process_section_lines(current_lines)
                    if processed_content:
                        result[current_section.lower().replace(' ', '_')] = processed_content

                # Start new section
                current_section = section
                current_lines = []

                # Check if value is on the same line
                value_part = stripped[len(f"{section}:"):].strip()
                if value_part:
                    current_lines.append((" " * 0, value_part))  # No indentation for same-line content

                section_found = True
                break

        if not section_found and current_section:
            # This line belongs to current section - store with original indentation
            leading_spaces = len(line) - len(line.lstrip())
            current_lines.append((line[:leading_spaces], stripped))

    # Don't forget the last section
    if current_section and current_lines:
        processed_content = _process_section_lines(current_lines)
        if processed_content:
            result[current_section.lower().replace(' ', '_')] = processed_content

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


def main():
    """Main sync function."""
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Sync problem metadata to PostgreSQL database')
    parser.add_argument('problem_slug', nargs='?', help='Specific problem slug to sync (e.g., "53-maximum-subarray"). If not provided, syncs all problems.')
    args = parser.parse_args()

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
            sync_problem_to_db(conn, args.problem_slug, problem_dir)
            print(f"\n🎉 Successfully synced {args.problem_slug}")
        except Exception as e:
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
                sync_problem_to_db(conn, problem_dir.name, problem_dir)
                success_count += 1
            except Exception as e:
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
