#!/usr/bin/env python3

"""
Extract problem metadata from backend/algorithms/problems/ directory structure.

This script scans each problem directory, extracts metadata from __init__.py and
solution files using simplified docstring format, and generates a JSON structure for MDX generation.

New simplified docstring format:
- __init__.py: Title:, Definition:, Leetcode:, Difficulty:, Topics:
- solution.py: Intuition:, Time Complexity:, Args:, Variables:, Returns:
"""

import ast
import json
from pathlib import Path
from code_cleaner import clean_code
from get_directory_timestamps import get_directory_timestamps


def ast_type_to_string(annotation) -> str:
    """Convert AST type annotation to string representation."""
    if annotation is None:
        return ""

    if isinstance(annotation, ast.Name):
        return annotation.id
    elif isinstance(annotation, ast.Subscript):
        # Handle list[int], dict[str, int], etc.
        value_str = ast_type_to_string(annotation.value)
        if isinstance(annotation.slice, ast.Name):
            slice_str = annotation.slice.id
        elif isinstance(annotation.slice, ast.Tuple):
            # Handle multiple type parameters like dict[str, int]
            slice_parts = [ast_type_to_string(elt) for elt in annotation.slice.elts]
            slice_str = ", ".join(slice_parts)
        else:
            slice_str = ast_type_to_string(annotation.slice)
        return f"{value_str}[{slice_str}]"
    elif isinstance(annotation, ast.Attribute):
        # Handle typing.List, typing.Optional, etc.
        return f"{ast_type_to_string(annotation.value)}.{annotation.attr}"
    elif isinstance(annotation, ast.Constant):
        return str(annotation.value)
    else:
        # Fallback: try to unparse if available (Python 3.9+)
        try:
            return ast.unparse(annotation)
        except AttributeError:
            return str(type(annotation).__name__)


def extract_function_signature_types(node: ast.FunctionDef) -> dict[str, str]:
    """Extract parameter and return types from function signature."""
    types = {
        'params': {},
        'return': ''
    }

    # Extract parameter types
    for arg in node.args.args:
        param_name = arg.arg
        param_type = ast_type_to_string(arg.annotation)
        if param_type:
            types['params'][param_name] = param_type

    # Extract return type
    return_type = ast_type_to_string(node.returns)
    if return_type:
        types['return'] = return_type

    return types

def parse_simple_docstring(docstring: str, expected_sections: list[str]) -> dict[str, str]:
    """
    Parse simplified docstring format extracting sections as-is.

    Format:
        Section Name: value (can be on same line or indented on next lines)
    """
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

        # Mapping:
        # - Items at base level (relative 0) → 4 spaces
        # - Items beyond base → 4 + relative_indent (preserves nesting)
        if relative_indent == 0:
            mdx_indent = 4
        else:
            # Preserve relative indentation: each level adds to base 4 spaces
            mdx_indent = 4 + relative_indent

        processed_lines.append(' ' * mdx_indent + content)

    return '\n'.join(processed_lines).strip()

def extract_function_code(content: str, node: ast.FunctionDef) -> str:
    """Extract function code and remove all docstrings using the new cleaner."""
    lines = content.splitlines()
    start_line = node.lineno - 1  # AST line numbers are 1-based
    end_line = node.end_lineno if node.end_lineno else len(lines)

    # Extract just the function code
    function_code = '\n'.join(lines[start_line:end_line])

    # Use the new cleaner to remove all docstrings
    return clean_code(function_code)


def extract_function_metadata(file_path: Path) -> dict[str, str]:
    """Extract metadata from a Python solution file using simplified docstring format."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse the AST
        tree = ast.parse(content)

        # Store the full file content (cleaned of docstrings) for tooltip system
        full_file_code = clean_code(content)

        # Find the main function (first function definition)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                docstring = ast.get_docstring(node, clean=True) or ""

                # Extract cleaned function code
                cleaned_code = extract_function_code(content, node)

                # Extract function signature types
                signature_types = extract_function_signature_types(node)

                # Parse the docstring using simplified format
                expected_sections = ['Intuition', 'Time Complexity', 'Space Complexity',
                                   'Args', 'Expressions', 'Variables', 'Returns']
                result = parse_simple_docstring(docstring, expected_sections)
                # result['code'] = cleaned_code
                result['code'] = full_file_code
                # result['full_file_code'] = full_file_code

                # Convert args to dictionary format
                if 'args' in result:
                    args_dict = {}
                    for line in result['args'].split('\n'):
                        line = line.strip()
                        if ':' in line and not line.startswith('`'):
                            # Extract parameter name from "param_name: description"
                            param_name = line.split(':')[0].strip()
                            description = ':'.join(line.split(':')[1:]).strip()

                            # Add type if available
                            if param_name in signature_types['params']:
                                param_type = signature_types['params'][param_name]
                                key = f"{param_name}: {param_type}"
                                args_dict[key] = description
                            else:
                                args_dict[param_name] = description

                    if args_dict:
                        result['args'] = args_dict

                # Convert expressions to dictionary format with multi-line support
                if 'expressions' in result:
                    expressions_dict = {}
                    lines = result['expressions'].split('\n')
                    i = 0

                    while i < len(lines):
                        line = lines[i].strip()

                        # Skip empty lines
                        if not line:
                            i += 1
                            continue

                        # Handle expressions wrapped in quotes with ': ' separator
                        if line.startswith("'") and "': " in line:
                            # Find the closing quote followed by ': '
                            quote_end = line.find("': ", 1)
                            if quote_end != -1:
                                expr_name = line[1:quote_end]  # Extract between quotes
                                description_parts = [line[quote_end + 3:]]  # Skip "': "

                                # Get base indentation level for this expression
                                base_indent = len(lines[i]) - len(lines[i].lstrip())

                                # Look ahead for continuation lines (more indented)
                                i += 1
                                while i < len(lines):
                                    next_line = lines[i]

                                    # Empty line - include it and continue
                                    if not next_line.strip():
                                        description_parts.append("")
                                        i += 1
                                        continue

                                    next_indent = len(next_line) - len(next_line.lstrip())

                                    # If this line is more indented than the base expression, it belongs to this expression
                                    if next_indent > base_indent:
                                        description_parts.append(next_line.rstrip())
                                        i += 1
                                    else:
                                        # This line is at the same level or less indented, so it's a new expression or end
                                        break

                                # Join all description parts and store
                                full_description = '\n'.join(description_parts).strip()
                                if full_description:
                                    expressions_dict[expr_name] = full_description
                            else:
                                i += 1
                        elif ':' in line:
                            # Fallback for non-quoted expressions
                            expr_name = line.split(':')[0].strip()
                            description = ':'.join(line.split(':')[1:]).strip()

                            # Remove surrounding quotes if present
                            if expr_name.startswith("'") and expr_name.endswith("'"):
                                expr_name = expr_name[1:-1]
                            elif expr_name.startswith('"') and expr_name.endswith('"'):
                                expr_name = expr_name[1:-1]

                            expressions_dict[expr_name] = description
                            i += 1
                        else:
                            # Line without proper format, skip it
                            i += 1

                    if expressions_dict:
                        result['expressions'] = expressions_dict

                # Convert variables to dictionary format
                if 'variables' in result:
                    variables_dict = {}
                    for line in result['variables'].split('\n'):
                        line = line.strip()
                        if ':' in line:
                            # Extract variable name from "variable: description"
                            var_name = line.split(':')[0].strip()
                            description = ':'.join(line.split(':')[1:]).strip()

                            # Remove surrounding quotes if present
                            if var_name.startswith("'") and var_name.endswith("'"):
                                var_name = var_name[1:-1]
                            elif var_name.startswith('"') and var_name.endswith('"'):
                                var_name = var_name[1:-1]

                            variables_dict[var_name] = description

                    if variables_dict:
                        result['variables'] = variables_dict

                # Enhance returns with type information if returns section exists
                if 'returns' in result and signature_types['return']:
                    return_desc = result['returns'].strip()
                    if not return_desc.startswith('`'):
                        result['returns'] = f"`{signature_types['return']}`: {return_desc}"

                return result

        # If no function found, return the cleaned file content
        full_file_code = clean_code(content)
        return {'code': full_file_code, 'full_file_code': full_file_code}

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return {}

def extract_problem_metadata(problem_dir: Path) -> dict[str, dict]:
    """Extract metadata from a problem directory using simplified docstring format."""
    problem_data = {
        'time_stamps': get_directory_timestamps(problem_dir),
        'solutions': {}
    }

    # Extract from __init__.py if exists
    init_file = problem_dir / '__init__.py'
    if init_file.exists():
        try:
            with open(init_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract docstring from module level
            tree = ast.parse(content)
            docstring = ast.get_docstring(tree, clean=True)
            if docstring:
                # Parse using simplified format for __init__.py sections
                expected_sections = ['Title', 'Definition', 'Leetcode', 'Difficulty', 'Topics', 'Group']
                meta = parse_simple_docstring(docstring, expected_sections)

                # Map sections to problem metadata fields (direct mapping)
                for key, value in meta.items():
                    if key == 'topics' and value:
                        # Handle Topics special case: "[Backtrack]" -> ["Backtrack"]
                        if value.startswith('[') and value.endswith(']'):
                            # Remove brackets and split by comma
                            topics_str = value[1:-1].strip()
                            if topics_str:
                                problem_data['topics'] = [topic.strip() for topic in topics_str.split(',')]
                        else:
                            # Fallback: treat as comma-separated string
                            problem_data['topics'] = [topic.strip() for topic in value.split(',')]
                    elif key == 'group' and value:
                        # Handle Group: parse into list of lists
                        # Format: [file1.py, file2.py]\n[file3.py] -> [["file1.py", "file2.py"], ["file3.py"]]
                        groups = []
                        for line in value.split('\n'):
                            line = line.strip()
                            if line.startswith('[') and line.endswith(']'):
                                # Extract content between brackets and split by comma
                                files = line[1:-1].split(',')
                                groups.append([f.strip() for f in files])
                        if groups:
                            problem_data['group'] = groups
                    else:
                        problem_data[key] = value

        except Exception as e:
            print(f"Error processing {init_file}: {e}")

    # Extract from all .py files (except __init__.py and files starting with _)
    for py_file in problem_dir.glob('*.py'):
        if py_file.name == '__init__.py':
            continue

        # Skip files starting with _ (like _template.py)
        if py_file.name.startswith('_'):
            continue

        solution_data = extract_function_metadata(py_file)
        if solution_data:
            problem_data['solutions'][py_file.name] = solution_data

    return problem_data

def process_directory(directory_path: Path, directory_name: str) -> dict[str, dict]:
    """Process a directory (problems or core) and extract metadata from all subdirectories."""
    if not directory_path.exists():
        print(f"{directory_name.title()} directory not found: {directory_path}")
        return {}

    all_items = {}

    # Process each subdirectory
    for item_dir in directory_path.iterdir():
        if not item_dir.is_dir() or item_dir.name.startswith('.'):
            continue

        print(f"Processing {directory_name}: {item_dir.name}")
        item_data = extract_problem_metadata(item_dir)

        if item_data:
            all_items[item_dir.name] = item_data

    return all_items

class CompactJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that keeps arrays compact (single-line)."""
    def encode(self, obj):
        if isinstance(obj, list):
            return '[' + ', '.join(json.dumps(item, ensure_ascii=False) if not isinstance(item, list)
                                   else '[' + ', '.join(json.dumps(x, ensure_ascii=False) for x in item) + ']'
                                   for item in obj) + ']'
        return super().encode(obj)

    def iterencode(self, obj, _one_shot=False):
        """Encode while keeping lists compact."""
        for chunk in super().iterencode(obj, _one_shot):
            yield chunk

def compact_json_dumps(obj):
    """Custom JSON serialization with compact arrays."""
    def format_value(value, depth=0):
        ind = '  ' * depth
        if isinstance(value, dict):
            if not value:
                return '{}'
            items = []
            for k, v in value.items():
                formatted_v = format_value(v, depth + 1)
                items.append(f'{ind}  {json.dumps(k, ensure_ascii=False)}: {formatted_v}')
            return '{\n' + ',\n'.join(items) + '\n' + ind + '}'
        elif isinstance(value, list):
            if not value:
                return '[]'
            # Compact array format
            if all(isinstance(item, list) for item in value):
                # List of lists (like group field)
                formatted_items = ['[' + ', '.join(json.dumps(x, ensure_ascii=False) for x in item) + ']' for item in value]
                return '[' + ', '.join(formatted_items) + ']'
            else:
                # Simple list (like topics field)
                return '[' + ', '.join(json.dumps(item, ensure_ascii=False) for item in value) + ']'
        else:
            return json.dumps(value, ensure_ascii=False)

    return format_value(obj)

def main():
    """Main extraction function."""
    # Path to algorithms directory (parent of both problems and core)
    algorithms_dir = Path(__file__).parent.parent.parent / 'algorithms'

    if not algorithms_dir.exists():
        print(f"Algorithms directory not found: {algorithms_dir}")
        return

    # Process both problems and core directories
    problems_dir = algorithms_dir / 'problems'
    core_dir = algorithms_dir / 'core'

    all_problems = process_directory(problems_dir, 'problems')
    all_core = process_directory(core_dir, 'core')

    # Generate output JSON with new structure
    output_data = {
        'problems': all_problems,
        'core': all_core
    }

    output_path = Path(__file__).parent.parent.parent.parent / 'lib' / 'extracted-metadata' / 'problems_metadata.json'
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(compact_json_dumps(output_data))

    print(f"\n✅ Extracted metadata for {len(all_problems)} problems and {len(all_core)} core algorithms")
    print(f"Output: {output_path}")

if __name__ == '__main__':
    main()