"""Extract problem and solution metadata from Python source files."""

import ast
import sys
from pathlib import Path
from datetime import datetime

# Import code cleaner
sys.path.append(str(Path(__file__).parent.parent))
from code_cleaner import clean_code


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
    """Get created/updated timestamps for directory.

    created_at uses the directory's birth time.
    updated_at uses the most recent mtime of any .py file inside,
    since editing a file doesn't update the directory's own mtime.
    """
    stat = directory.stat()
    latest_mtime = stat.st_mtime
    for f in directory.glob('*.py'):
        latest_mtime = max(latest_mtime, f.stat().st_mtime)
    return {
        'created_at': datetime.fromtimestamp(stat.st_birthtime).isoformat(),
        'updated_at': datetime.fromtimestamp(latest_mtime).isoformat()
    }
