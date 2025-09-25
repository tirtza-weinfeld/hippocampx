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


def find_expression_positions(source_lines: list[str], expr_text: str) -> list[dict]:
    """
    Find all occurrences of an expression in source code.
    
    Args:
        source_lines: List of source code lines
        expr_text: Expression text to search for (e.g., "hold1 = max(hold1, -p)")
    
    Returns:
        List of position dictionaries with LSP-style ranges (0-based, consistent with generate_uses.py)
    """
    positions = []
    
    for line_num, line in enumerate(source_lines):
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
        # Read the source code (keep raw for docstring parsing, but also get cleaned for position matching)
        raw_code = file_path.read_text(encoding="utf-8")
        cleaned_code = clean_code(raw_code)
        source_lines = cleaned_code.split('\n')
        
        # Parse the RAW file to extract function metadata including expressions (need docstrings!)
        import ast
        tree = ast.parse(raw_code)
        
        def process_node_with_context(node, context_path=""):
            """Recursively process AST nodes, maintaining the full context path."""
            if isinstance(node, ast.ClassDef):
                class_name = node.name
                new_context = f"{context_path}.{class_name}" if context_path else class_name
                # Process all nodes within this class
                for child_node in node.body:
                    process_node_with_context(child_node, new_context)

            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                function_name = node.name
                new_context = f"{context_path}.{function_name}" if context_path else function_name

                # Process docstring for this function/method
                docstring = ast.get_docstring(node)
                if docstring:
                    # Extract metadata including expressions
                    metadata = extract_metadata(raw_doc=docstring, node=node)

                    # Check if this function has documented expressions
                    if 'expressions' in metadata and metadata['expressions']:
                        # Process each documented expression
                        for expr_text, description in metadata['expressions'].items():
                            # Find all occurrences of this expression in the source
                            positions = find_expression_positions(source_lines, expr_text)

                            # Create expression entries for each occurrence
                            for pos in positions:
                                qname = f"{module_name}:{new_context}.{expr_text}"

                                expression_entry = {
                                    "range": pos["range"],
                                    "nameRange": pos["nameRange"],
                                    "qname": qname,
                                    "kind": "expression"
                                }
                                expressions.append(expression_entry)

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