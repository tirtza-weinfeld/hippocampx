#!/usr/bin/env python3
"""
Generate expressions.json for expression tooltips.

This script extracts documented expressions from Python files and generates
position data for tooltip rendering. It works alongside the existing symbol
tooltip system without interfering with it.

The output expressions.json contains position information for expressions
documented in docstrings under "Expressions:" sections.

CLI:
  python3 generate_expressions.py \
    --root ../../algorithms/new \
    --out ../../lib/extracted-metadata/expressions.json
"""

import argparse
import json
import sys
from pathlib import Path

# Add current directory to Python path to import utilities
sys.path.insert(0, str(Path(__file__).parent))
from docstring_parser import extract_metadata
from code_cleaner import clean_code


def find_expression_positions(source_lines: list[str], expr_text: str,
                              start_line: int = 0, end_line: int | None = None) -> list[dict]:
    """
    Find all occurrences of an expression in source code within a line range.

    Args:
        source_lines: List of source code lines
        expr_text: Expression text to search for (e.g., "hold1 = max(hold1, -p)")
        start_line: 0-based start line (inclusive) to scope the search
        end_line: 0-based end line (exclusive) to scope the search

    Returns:
        List of position dictionaries with LSP-style ranges (0-based, consistent with generate_uses.py)
    """
    positions = []
    if end_line is None:
        end_line = len(source_lines)

    for line_num, line in enumerate(source_lines[start_line:end_line], start=start_line):
        start_char = 0
        while True:
            pos = line.find(expr_text, start_char)
            if pos == -1:
                break
            
            # Create LSP-style range for the full expression
            # Use same 0-based indexing as generate_uses.py and generate_lsp_index.py
            position = {
                "range": {
                    "start": {"line": line_num, "character": pos},
                    "end": {"line": line_num, "character": pos + len(expr_text)}
                },
                "nameRange": {
                    "start": {"line": line_num, "character": pos},
                    "end": {"line": line_num, "character": pos + len(expr_text)}
                }
            }
            positions.append(position)
            
            # Continue searching from next character to find overlapping matches
            start_char = pos + 1
    
    return positions


def extract_file_expressions(file_path: Path, module_name: str) -> list[dict]:
    """
    Extract all documented expressions from a Python file.
    
    Args:
        file_path: Path to the Python file
        module_name: Module name for qname generation
    
    Returns:
        List of expression entries with position and metadata
    """
    expressions = []
    
    try:
        # Read both raw (for AST/docstrings) and cleaned (for position matching)
        raw_code = file_path.read_text(encoding="utf-8")
        cleaned_code = clean_code(raw_code)
        cleaned_lines = cleaned_code.split('\n')
        raw_lines = raw_code.split('\n')
        
        # Parse the RAW file to extract function metadata including expressions (need docstrings!)
        import ast
        tree = ast.parse(raw_code)
        
        def process_expressions(node, context_path, search_start, search_end):
            """Extract expressions from a node's docstring, scoped to its line range.

            Searches raw_lines within the node's AST range to find which raw lines
            contain the expression, then finds the same expression in cleaned_lines
            for the final position output (since the frontend renders cleaned code).
            """
            docstring = ast.get_docstring(node)
            if not docstring:
                return
            metadata = extract_metadata(raw_doc=docstring, node=node)
            if 'expressions' not in metadata or not metadata['expressions']:
                return

            # Build a mapping from raw line index -> cleaned line index
            # clean_code removes docstring lines and collapses blanks, so we
            # need to know which raw lines survived and where they ended up.
            # We do this by matching raw lines to cleaned lines in order.
            raw_to_clean = {}
            clean_idx = 0
            for raw_idx in range(len(raw_lines)):
                if clean_idx < len(cleaned_lines) and raw_lines[raw_idx] == cleaned_lines[clean_idx]:
                    raw_to_clean[raw_idx] = clean_idx
                    clean_idx += 1

            for expr_text, description in metadata['expressions'].items():
                # Search raw lines within this node's range
                raw_positions = find_expression_positions(
                    raw_lines, expr_text,
                    start_line=search_start,
                    end_line=search_end
                )
                for pos in raw_positions:
                    raw_line = pos["range"]["start"]["line"]
                    # Skip matches inside docstrings (they won't be in cleaned code)
                    if raw_line not in raw_to_clean:
                        continue
                    clean_line = raw_to_clean[raw_line]
                    char_start = pos["range"]["start"]["character"]
                    char_end = pos["range"]["end"]["character"]
                    qname = f"{module_name}:{context_path}.{expr_text}"
                    expressions.append({
                        "range": {
                            "start": {"line": clean_line, "character": char_start},
                            "end": {"line": clean_line, "character": char_end}
                        },
                        "nameRange": {
                            "start": {"line": clean_line, "character": char_start},
                            "end": {"line": clean_line, "character": char_end}
                        },
                        "qname": qname,
                        "kind": "expression"
                    })

        def process_node_with_context(node, context_path=""):
            """Recursively process AST nodes, maintaining the full context path."""
            if isinstance(node, ast.ClassDef):
                class_name = node.name
                new_context = f"{context_path}.{class_name}" if context_path else class_name
                # Process class-level docstring — expressions apply to the entire class body
                class_start = node.lineno - 1  # 0-based
                class_end = node.end_lineno     # exclusive (end_lineno is 1-based, so already exclusive)
                process_expressions(node, new_context, class_start, class_end)
                # Process all nodes within this class
                for child_node in node.body:
                    process_node_with_context(child_node, new_context)

            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                function_name = node.name
                new_context = f"{context_path}.{function_name}" if context_path else function_name

                # Process docstring — scope search to this function's line range only
                func_start = node.lineno - 1
                func_end = node.end_lineno
                process_expressions(node, new_context, func_start, func_end)

                # Process nested functions within this function
                for child_node in node.body:
                    if isinstance(child_node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        process_node_with_context(child_node, new_context)

        # Start processing from the root
        for node in tree.body:
            process_node_with_context(node)
    
    except Exception as e:
        print(f"Warning: Failed to process {file_path}: {e}")
    
    return expressions


def module_name_from_path(root: Path, file_path: Path) -> str:
    """Convert file path to dotted module name."""
    rel_path = file_path.resolve().relative_to(root.resolve())
    parts = list(rel_path.parts)
    parts[-1] = parts[-1].removesuffix(".py")
    return ".".join(parts)


def main():
    parser = argparse.ArgumentParser(description="Generate expressions.json for expression tooltips")
    parser.add_argument("--root", default="backend/algorithms/new",
                        help="Root directory to scan for Python files")
    parser.add_argument("--out", default="lib/extracted-metadata/expressions.json",
                        help="Output JSON file path")
    parser.add_argument("--problem", type=str,
                        help="Specific problem slug to process (e.g., '53-maximum-subarray')")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Error: Root directory {root} does not exist")
        return 1

    # Collect expressions from all Python files
    all_expressions: dict[str, list[dict]] = {}
    total_expressions = 0

    for py_file in root.rglob("*.py"):
        if not py_file.is_file():
            continue

        # Skip hidden directories and __pycache__
        if any(part.startswith('.') or part == '__pycache__' for part in py_file.parts):
            continue

        # Filter to specific problem if provided
        if args.problem and f"problems/{args.problem}/" not in str(py_file):
            continue
        
        # Generate module name and extract expressions
        module_name = module_name_from_path(root, py_file)
        file_expressions = extract_file_expressions(py_file, module_name)
        
        if file_expressions:
            rel_path = str(py_file.relative_to(root))
            all_expressions[rel_path] = file_expressions
            total_expressions += len(file_expressions)
            print(f"Found {len(file_expressions)} expressions in {rel_path}")
    
    # Write output file
    output_path = Path(args.out)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if args.problem:
        # Single problem mode - merge with existing data
        if output_path.exists():
            existing_data = json.loads(output_path.read_text(encoding="utf-8"))
            # Remove old entries for this problem
            problem_prefix = f"problems/{args.problem}/"
            existing_data = {k: v for k, v in existing_data.items() if not k.startswith(problem_prefix)}
            # Merge with new data
            existing_data.update(all_expressions)
            all_expressions = existing_data

    # Use compact JSON formatting similar to generate_uses.py
    def compact_json(obj, indent=0):
        if isinstance(obj, dict):
            if "range" in obj and "qname" in obj:  # Expression entry
                range_obj = obj["range"]
                name_range_obj = obj["nameRange"]
                start = range_obj["start"]
                end = range_obj["end"]
                name_start = name_range_obj["start"]
                name_end = name_range_obj["end"]
                qname = json.dumps(obj["qname"])
                kind = json.dumps(obj["kind"])
                return f'{{"range": {{"start": {{"line": {start["line"]}, "character": {start["character"]}}}, "end": {{"line": {end["line"]}, "character": {end["character"]}}}}}, "nameRange": {{"start": {{"line": {name_start["line"]}, "character": {name_start["character"]}}}, "end": {{"line": {name_end["line"]}, "character": {name_end["character"]}}}}}, "qname": {qname}, "kind": {kind}}}'
            else:
                items = []
                for k, v in obj.items():
                    key = json.dumps(k)
                    if isinstance(v, list) and all(isinstance(item, dict) and "range" in item for item in v):
                        # List of expression objects
                        expr_items = [compact_json(item, 0) for item in v]
                        expr_str = "[\n" + ",\n".join(f"    {item}" for item in expr_items) + "\n  ]"
                        items.append(f"  {key}: {expr_str}")
                    else:
                        items.append(f"  {key}: {compact_json(v, indent + 2)}")
                return "{\n" + ",\n".join(items) + "\n}"
        elif isinstance(obj, list):
            return "[" + ", ".join(compact_json(item, indent) for item in obj) + "]"
        else:
            return json.dumps(obj, ensure_ascii=False)
    
    output_path.write_text(compact_json(all_expressions), encoding="utf-8")
    print(f"\nWrote {output_path} • {total_expressions} expressions from {len(all_expressions)} files")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())