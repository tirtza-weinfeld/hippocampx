#!/usr/bin/env python3
"""
Generate a flat `symbol_tags.json` for build-time filtering + tooltips.

Design (latest-only):
- Python 3.13.x; no __future__ imports, no typing backports.
- Emits a single JSON object keyed by qualified name (qname):
    { "<module>:<path.to.symbol>": { <metadata> }, ... }
- Metadata is data-only (no HTML). Sources:
  1) Google-style sections in docstrings: Args, Returns, Raises, Examples,
     Topics, Difficulty, Time Complexity, Space Complexity.

CLI:
  python3 generate_symbol_tags.py \
    --root ../../algorithms/new \
    --out  ../../lib/extracted-metadata/symbol_tags.json

Output is stable and pretty (sorted keys).
"""

import argparse
import ast
import json
import sys
from pathlib import Path

# Import shared docstring parsing utilities
from docstring_parser import extract_metadata
from code_cleaner import clean_code

# ---------- Defaults ----------
DEFAULT_ROOT: Path = Path("../../algorithms/new")
DEFAULT_OUT: Path = Path("../../lib/extracted-metadata/symbol_tags.json")


# ---------- Filesystem ----------

def iter_py(root: Path) -> list[Path]:
    """All .py files under root (skip hidden dirs and __pycache__)."""
    root = root.resolve()
    out: list[Path] = []
    for p in root.rglob("*.py"):
        if not p.is_file():
            continue
        parts = p.parts
        if "__pycache__" in parts or any(seg.startswith(".") for seg in parts):
            continue
        out.append(p)
    return out


def module_name(root: Path, file: Path) -> str:
    """Derive dotted module name from path relative to root."""
    rel = file.resolve().relative_to(root.resolve())
    pieces = list(rel.parts)
    if pieces[-1].endswith(".py"):
        pieces[-1] = pieces[-1][:-3]
    return ".".join(pieces)


# ---------- Signature extraction ----------

def _extract_function_signature(node: ast.FunctionDef | ast.AsyncFunctionDef) -> str:
    """Extract complete function signature from AST node (LSP style)."""
    try:
        # Start with def/async def keyword
        if isinstance(node, ast.AsyncFunctionDef):
            sig_parts = ["async def ", node.name, "("]
        else:
            sig_parts = ["def ", node.name, "("]
        
        # Add parameters
        params = []
        for arg in node.args.args:
            param_str = arg.arg
            if arg.annotation:
                param_str += f": {ast.unparse(arg.annotation)}"
            params.append(param_str)
        
        sig_parts.append(", ".join(params))
        sig_parts.append(")")
        
        # Add return type if present
        if node.returns:
            sig_parts.append(f" -> {ast.unparse(node.returns)}")
        
        return "".join(sig_parts)
    except Exception:
        # Fallback to just function name if signature extraction fails
        return node.name


# ---------- AST walk / qname ----------

def walk_symbols(mod: str, tree: ast.AST) -> list[tuple[str, ast.AST, bool]]:
    """Return (qname, node, is_method) for classes, functions (incl. nested) and methods."""
    out: list[tuple[str, ast.AST, bool]] = []

    def visit(body: list[ast.stmt], qual: list[str], in_class: bool = False) -> None:
        for node in body:
            if isinstance(node, ast.ClassDef):
                q = f"{mod}:{'.'.join(qual+[node.name]) if qual else node.name}"
                out.append((q, node, False))  # Classes are never methods
                visit(node.body, qual + [node.name], True)  # Now we're inside a class
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                q = f"{mod}:{'.'.join(qual+[node.name]) if qual else node.name}"
                out.append((q, node, in_class))  # is_method = in_class
                visit(node.body, qual + [node.name], in_class)  # Preserve class context
            # skip others

    visit(getattr(tree, "body", []), [], False)
    return out


# ---------- Builder ----------

def extract_name_from_qname(qname: str) -> str:
    """Extract the name from qname (everything after the last '.' or ':')"""
    return qname.split(':')[-1].split('.')[-1] if ':' in qname or '.' in qname else qname

def build_symbol_tags(root: Path) -> dict[str, dict[str, object]]:
    tags: dict[str, dict[str, object]] = {}

    for f in iter_py(root):
        try:
            text = f.read_text(encoding="utf-8")
            tree = ast.parse(text)
        except Exception as e:  # keep going; report
            print(f"[warn] skipping {f}: {e}", file=sys.stderr)
            continue

        mod = module_name(root, f)
        for qname, node, is_method in walk_symbols(mod, tree):
            raw = ast.get_docstring(node, clean=True) or ""
            
            # Skip entries with no docstring
            if not raw.strip():
                continue
                
            meta = extract_metadata(raw, node)

            # Process the main symbol entry
            main_entry = dict(meta) if meta else {}
            
            # Convert returns "documentation" field to "summary" for consistency
            if "returns" in main_entry and isinstance(main_entry["returns"], dict):
                returns_data = main_entry["returns"]
                if "documentation" in returns_data:
                    returns_data["summary"] = returns_data.pop("documentation")
            
            # Add name field extracted from qname
            main_entry["name"] = extract_name_from_qname(qname)
            
            # Add kind field based on AST node type
            if isinstance(node, ast.ClassDef):
                main_entry["kind"] = "class"
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                # Use the is_method flag from walk_symbols which tracks class context
                main_entry["kind"] = "method" if is_method else "function"
                
                # Extract function signature
                signature = _extract_function_signature(node)
                if signature:
                    main_entry["label"] = signature
            
            # Extract variables and args for flattening
            variables_dict = meta.get("variables", {}) if meta else {}
            args_dict = meta.get("args", {}) if meta else {}
            
            # If no args from docstring but this is a function, extract parameters from AST
            if not args_dict and isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                args_dict = {}
                for arg in node.args.args:
                    param_name = arg.arg
                    arg_info = {}
                    if arg.annotation:
                        arg_info["label"] = ast.unparse(arg.annotation)
                    # Don't add documentation field if it would be None/null
                    args_dict[param_name] = arg_info
            
            # Convert variables dict to list of names for parent reference
            if variables_dict:
                main_entry["variables"] = list(variables_dict.keys())
            
            # Convert args dict to list of names for parent reference  
            if args_dict:
                main_entry["args"] = list(args_dict.keys())
            
            # Extract and clean code for functions and classes  
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                # Extract only the specific function/class code, not the entire file
                lines = text.splitlines()
                start_line = node.lineno - 1  # AST line numbers are 1-based
                end_line = node.end_lineno if node.end_lineno else len(lines)
                
                # Extract just the function/class definition
                function_lines = lines[start_line:end_line]
                function_code = '\n'.join(function_lines)
                
                # Clean the extracted code (remove docstrings, etc.)
                cleaned_function_code = clean_code(function_code)
                main_entry["code"] = cleaned_function_code
                
                # Calculate relative file path (same approach as extract_problems_metadata.py)
                try:
                    relative_file_path = str(f.relative_to(Path.cwd()))
                except ValueError:
                    relative_file_path = str(f)
                main_entry["file_path"] = relative_file_path
            
            tags[qname] = main_entry
            
            # Create individual entries for variables (only if they exist)
            if isinstance(variables_dict, dict):
                for var_name, var_desc in variables_dict.items():
                    var_qname = f"{qname}.{var_name}"
                    tags[var_qname] = {
                        "name": extract_name_from_qname(var_qname),
                        "summary": var_desc,
                        "kind": "variable"
                    }
            
            # Create individual entries for args/parameters (only if they have documentation)
            if isinstance(args_dict, dict):
                for arg_name, arg_info in args_dict.items():
                    arg_qname = f"{qname}.{arg_name}"
                    arg_entry = {
                        "name": extract_name_from_qname(arg_qname),
                        "kind": "parameter"
                    }
                    
                    has_documentation = False
                    
                    if isinstance(arg_info, dict):
                        # Create LSP-style label: "name: type"
                        if "label" in arg_info and arg_info["label"] is not None:
                            arg_entry["label"] = f"{arg_name}: {arg_info['label']}"
                        else:
                            # No type annotation, just name
                            arg_entry["label"] = arg_name
                        if "documentation" in arg_info and arg_info["documentation"] is not None:
                            arg_entry["summary"] = arg_info["documentation"]
                            has_documentation = True
                    elif isinstance(arg_info, str):
                        # Simple string description, no type
                        arg_entry["label"] = arg_name
                        arg_entry["summary"] = arg_info
                        has_documentation = True
                    
                    # Only add parameter entries that have documentation
                    if has_documentation:
                        tags[arg_qname] = arg_entry
            
            # Create individual entries for expressions (only if they exist)
            expressions_dict = meta.get("expressions")
            if isinstance(expressions_dict, dict):
                for expr_text, expr_desc in expressions_dict.items():
                    expr_qname = f"{qname}.{expr_text}"
                    tags[expr_qname] = {
                        "name": expr_text,
                        "summary": expr_desc,
                        "kind": "expression"
                    }

    return tags


# ---------- Main ----------

def format_json_compact_arrays(data: dict[str, dict[str, object]]) -> str:
    """Format JSON with compact arrays and simple objects but indented complex objects."""
    # First format with standard indentation
    formatted = json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True)
    
    import re
    
    # Replace multi-line arrays with single-line arrays
    # Pattern to match arrays like: [\n      "item1",\n      "item2"\n    ]
    array_pattern = r'\[\n\s*(".*?"(?:,\n\s*".*?")*)\n\s*\]'
    
    def compact_array(match):
        content = match.group(1)
        # Remove newlines and extra spaces, keep items comma-separated
        items = re.findall(r'".*?"', content)
        return '[' + ', '.join(items) + ']'
    
    formatted = re.sub(array_pattern, compact_array, formatted)
    
    # Replace simple single-property objects with single-line objects
    # Pattern to match objects like: {\n      "key": "value"\n    }
    simple_object_pattern = r'\{\n\s*(".*?"):\s*(".*?")\n\s*\}'
    formatted = re.sub(simple_object_pattern, r'{\1: \2}', formatted)
    
    # Also handle objects with non-string values like numbers, booleans
    # Pattern to match objects like: {\n      "key": value\n    } where value is not a string
    simple_object_non_string_pattern = r'\{\n\s*(".*?"):\s*([^"\n\{\[]+)\n\s*\}'
    formatted = re.sub(simple_object_non_string_pattern, r'{\1: \2}', formatted)
    
    return formatted


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate flat symbol_tags.json for tooltips/filtering.")
    ap.add_argument("--root", type=Path, default=DEFAULT_ROOT, help=f"Workspace root (default: {DEFAULT_ROOT})")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help=f"Output JSON path (default: {DEFAULT_OUT})")
    args = ap.parse_args()

    data = build_symbol_tags(args.root)
    formatted_json = format_json_compact_arrays(data)
    args.out.write_text(formatted_json, encoding="utf-8")
    print(f"Wrote {args.out} • {len(data)} symbols")


if __name__ == "__main__":
    main()