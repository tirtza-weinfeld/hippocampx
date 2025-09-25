#!/usr/bin/env python3
"""
Generate a strict LSP-shaped symbol index for a Python workspace.

Output JSON shape:
{
  "documents": [
    {
      "uri": "file:///abs/path/to/file.py",
      "symbols": [ DocumentSymbol, ... ]
    },
    ...
  ]
}

Rules:
- LSP coordinates are 0-based for line/character.
- SymbolKind uses official numeric codes (Class=5, Method=6, Function=12, Variable=13).
- detail: "name(arg: Type, ...) -> Ret" for defs; "class Name" for classes.
- children: nested functions within functions; methods (and nested) within classes.
- selectionRange: spans just the identifier token in the header (found by scanning the header line).
"""

import argparse
import ast
import json
import re
import sys
from pathlib import Path

# Add the current directory to Python path to import code_cleaner
sys.path.insert(0, str(Path(__file__).parent))
from code_cleaner import clean_code

try:
    from lsprotocol.types import SymbolKind
except ImportError:
    # Fallback to official LSP 3.17 specification constants
    # Source: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#symbolKind
    class SymbolKind:
        FILE = 1
        MODULE = 2
        NAMESPACE = 3
        PACKAGE = 4
        CLASS = 5
        METHOD = 6
        PROPERTY = 7
        FIELD = 8
        CONSTRUCTOR = 9
        ENUM = 10
        INTERFACE = 11
        FUNCTION = 12
        VARIABLE = 13
        CONSTANT = 14
        STRING = 15
        NUMBER = 16
        BOOLEAN = 17
        ARRAY = 18
        OBJECT = 19
        KEY = 20
        NULL = 21
        ENUM_MEMBER = 22
        STRUCT = 23
        EVENT = 24
        OPERATOR = 25
        TYPE_PARAMETER = 26

def file_uri(p: Path, scan_root: Path, uri_base: str = "") -> str:
    p = p.resolve()
    scan_root = scan_root.resolve()
    # Get relative path from scan root
    try:
        rel_path = p.relative_to(scan_root)
        if uri_base:
            return f"{uri_base.rstrip('/')}/{rel_path.as_posix()}"
        else:
            return rel_path.as_posix()
    except ValueError:
        # Fallback to absolute path
        return str(p)

# -- AST helpers ---------------------------------------------------------------

def _unparse(node: ast.AST | None) -> str:
    if node is None:
        return ""
    try:
        return ast.unparse(node)
    except Exception:
        return ""

def _param_sig(a: ast.arg) -> str:
    ann = _unparse(a.annotation)
    return f"{a.arg}: {ann}" if ann else a.arg

def _format_signature(name: str, args: ast.arguments, returns: ast.AST | None, is_method: bool) -> str:
    parts: list[str] = []

    # Positional-only (Python keeps them separate)
    posonly = getattr(args, "posonlyargs", [])
    for a in posonly:
        parts.append(_param_sig(a))
    if posonly:
        parts.append("/")

    # Regular args (may have defaults)
    reg = list(args.args)
    # Drop leading self for methods (purely cosmetic)
    if is_method and reg and reg[0].arg == "self":
        reg = reg[1:]
    parts.extend(_param_sig(a) for a in reg)

    # Vararg
    if args.vararg:
        parts.append("*" + _param_sig(args.vararg))

    # Keyword-only
    if args.kwonlyargs:
        if not args.vararg:
            parts.append("*")  # separator if no *args
        parts.extend(_param_sig(a) for a in args.kwonlyargs)

    # Kwvararg
    if args.kwarg:
        parts.append("**" + _param_sig(args.kwarg))

    sig = f"{name}(" + ", ".join(parts) + ")"
    ret = _unparse(returns)
    if ret:
        sig += f" -> {ret}"
    return sig

def _node_header_line(text_lines: list[str], node: ast.AST) -> tuple[int, str]:
    """Return (zero_based_line_index, line_text) for the header line of def/class."""
    line0 = (node.lineno - 1)
    return line0, text_lines[line0]

def _find_name_span_in_header(header: str, kind: str, name: str) -> tuple[int, int]:
    """
    Return (start_col, end_col) for the identifier in 'def/async def/class' header.
    Simple robust scan (no regex brittle to indent/comments).
    """
    s = header
    # Strip leading indent but keep original indices
    idx = 0
    while idx < len(s) and s[idx].isspace():
        idx += 1
    # Accept 'async def ' or 'def ' or 'class '
    prefixes = []
    if kind == "function" or kind == "method":
        prefixes = ["def ", "async def "]
    elif kind == "class":
        prefixes = ["class "]
    else:
        prefixes = ["def ", "async def ", "class "]

    start = None
    for pref in prefixes:
        pos = s.find(pref, idx)
        if pos != -1:
            name_pos = pos + len(pref)
            # skip whitespace
            while name_pos < len(s) and s[name_pos].isspace():
                name_pos += 1
            if s.startswith(name, name_pos):
                start = name_pos
                break
    if start is None:
        # fallback: linear search
        start = s.find(name, idx)
        if start == -1:
            start = idx
    end = start + len(name)
    return start, end

def _docstring_blocks(node: ast.AST) -> dict:
    """
    Parse the docstring into structured blocks (best-effort; keeps plain text if sections not found).
    Sections recognized: Args, Returns, Raises, Examples (Google-style).
    """
    doc = ast.get_docstring(node, clean=True) or ""
    if not doc:
        return {}
    lines = [ln.rstrip() for ln in doc.splitlines()]
    blocks: dict[str, list[str]] = {"summary": [], "Args": [], "Returns": [], "Raises": [], "Examples": []}
    section = "summary"
    for ln in lines:
        head = ln.strip()
        if head.endswith(":") and head[:-1] in ("Args", "Returns", "Raises", "Examples"):
            section = head[:-1]
            continue
        blocks[section].append(ln)

    # Compact summaries
    summary = "\n".join([ln for ln in blocks["summary"] if ln.strip()])
    def _clean(sec: str) -> str | None:
        if sec == "summary":
            return summary or None
        body = [ln for ln in blocks[sec] if ln.strip()]
        if not body:
            return None
        if sec == "Examples":
            return "\n".join(body)
        return "\n".join(body)

    out: dict = {}
    if summary:
        out["summary"] = summary
    for sec in ("Args", "Returns", "Raises", "Examples"):
        val = _clean(sec)
        if val is not None:
            # Optionally further parse Args bullets into name/desc pairs:
            if sec == "Args":
                parsed: list[dict] = []
                for raw in val.splitlines():
                    # expect "name: desc"
                    if ":" in raw:
                        n, d = raw.split(":", 1)
                        parsed.append({"name": n.strip(), "desc": d.strip()})
                    else:
                        parsed.append({"name": "", "desc": raw.strip()})
                out["args"] = parsed
            elif sec == "Returns":
                out["returns"] = val
            elif sec == "Raises":
                out["raises"] = val
            elif sec == "Examples":
                out["examples"] = val
    return out

def _make_range(node: ast.AST) -> dict:
    """Create range using cleaned code AST positions (consistent with generate_uses.py)."""
    start_line = node.lineno - 1  # Convert to 0-based
    end_line = getattr(node, "end_lineno", node.lineno) - 1
    
    return {
        "start": {"line": start_line, "character": getattr(node, "col_offset", 0)},
        "end": {"line": end_line, "character": getattr(node, "end_col_offset", 0)},
    }

def _symbol_kind(node: ast.AST, parent_is_class: bool) -> int:
    if isinstance(node, ast.ClassDef):
        return SymbolKind.CLASS
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return SymbolKind.METHOD if parent_is_class else SymbolKind.FUNCTION
    return SymbolKind.VARIABLE

def _detail_for(node: ast.AST, is_method: bool) -> str:
    if isinstance(node, ast.ClassDef):
        return f"class {node.name}"
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return _format_signature(node.name, node.args, node.returns, is_method)
    return node.__class__.__name__

def _collect_children(node: ast.AST, cleaned_text_lines: list[str], parent_is_class: bool) -> list[dict]:
    symbols: list[dict] = []
    for child in getattr(node, "body", []):
        if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            symbols.append(_symbol_entry(child, cleaned_text_lines, parent_is_class))
    # Ensure stable order by start position
    symbols.sort(key=lambda s: (s["range"]["start"]["line"], s["range"]["start"]["character"]))
    return symbols

def _symbol_entry(node: ast.AST, cleaned_text_lines: list[str], parent_is_class: bool) -> dict:
    kind = _symbol_kind(node, parent_is_class)
    detail = _detail_for(node, is_method=(kind == SymbolKind.METHOD))
    rng = _make_range(node)
    
    # For name range, use the cleaned code line (consistent with generate_uses.py)
    cleaned_line_idx = node.lineno - 1
    if cleaned_line_idx < len(cleaned_text_lines):
        header = cleaned_text_lines[cleaned_line_idx]
        sel_start, sel_end = _find_name_span_in_header(header, "class" if kind == SymbolKind.CLASS else "method" if kind == SymbolKind.METHOD else "function", getattr(node, "name", ""))
        name_range = {"start": {"line": cleaned_line_idx, "character": sel_start}, "end": {"line": cleaned_line_idx, "character": sel_end}}
    else:
        # Fallback to full range if line not found
        name_range = rng

    entry: dict = {
        "name": getattr(node, "name", ""),
        "detail": detail,
        "kind": kind,
        "range": rng,
        "nameRange": name_range,  # Changed from selectionRange to nameRange for consistency
        "children": _collect_children(node, cleaned_text_lines, parent_is_class=(kind == SymbolKind.CLASS)),
    }
    return entry

def build_document_symbols(py_path: Path, scan_root: Path, uri_base: str = "") -> dict:
    # Read and clean the code using the same logic as other scripts
    raw_text = py_path.read_text(encoding="utf-8")
    cleaned_text = clean_code(raw_text)
    
    # Use cleaned text lines for consistent positioning
    cleaned_text_lines = cleaned_text.splitlines()
    
    try:
        tree = ast.parse(cleaned_text)
    except SyntaxError as e:
        raise RuntimeError(f"Syntax error in {py_path}: {e}") from e
    # Ensure end_lineno/end_col_offset are available
    ast.increment_lineno(tree, n=0)  # no-op; ensures attributes are set on some Python versions

    top_symbols: list[dict] = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            top_symbols.append(_symbol_entry(node, cleaned_text_lines, parent_is_class=False))
        # (optional) add simple top-level variables:
        # elif isinstance(node, ast.Assign) and all(isinstance(t, ast.Name) for t in node.targets):
        #     ...

    # Sort by position for stability
    top_symbols.sort(key=lambda s: (s["range"]["start"]["line"], s["range"]["start"]["character"]))
    return {
        "uri": file_uri(py_path, scan_root, uri_base),
        "symbols": top_symbols,
    }

def iter_python_files(root: Path) -> list[Path]:
    return [p for p in root.rglob("*.py") if p.is_file() and "__pycache__" not in p.parts and not any(part.startswith(".") for part in p.parts)]

def main() -> None:
    # Calculate project root relative to script location
    project_root = Path(__file__).resolve().parent.parent.parent.parent
    default_root = project_root / "backend" / "algorithms" / "new"
    default_output = project_root / "lib" / "extracted-metadata" / "lsp_index.json"
    
    ap = argparse.ArgumentParser(description="Generate LSP-shaped symbol index for Python files.")
    ap.add_argument("--root", type=Path, default=default_root, help=f"Workspace root (default: {default_root})")
    ap.add_argument("--out", type=Path, default=default_output, help=f"Output JSON path (default: {default_output})")
    ap.add_argument("--uri-base", type=str, default="", help="Base path for URI generation (e.g., 'repo/src')")
    args = ap.parse_args()

    files = iter_python_files(args.root)
    documents: list[dict] = []
    errors: list[str] = []

    for f in files:
        try:
            doc = build_document_symbols(f, args.root, args.uri_base)
            documents.append(doc)
        except Exception as e:
            errors.append(f"{f}: {e}")

    # Sort documents by URI
    documents.sort(key=lambda d: d["uri"])

    payload = {"documents": documents}

    # Ensure output directory exists
    args.out.parent.mkdir(parents=True, exist_ok=True)

    # Custom JSON formatting for compact ranges
    # Use ensure_ascii=True to properly escape backslashes and avoid SyntaxWarnings
    json_str = json.dumps(payload, ensure_ascii=True, indent=2)
    
    # Make range and selectionRange objects single-line
    json_str = re.sub(
        r'"(range|selectionRange)":\s*{\s*\n\s*"start":\s*{\s*\n\s*"line":\s*(\d+),\s*\n\s*"character":\s*(\d+)\s*\n\s*},\s*\n\s*"end":\s*{\s*\n\s*"line":\s*(\d+),\s*\n\s*"character":\s*(\d+)\s*\n\s*}\s*\n\s*}', 
        r'"\1": {"start": {"line": \2, "character": \3}, "end": {"line": \4, "character": \5}}', 
        json_str
    )
    
    args.out.write_text(json_str, encoding="utf-8")

    # Simple summary to stderr/stdout
    print(f"Wrote {args.out} • {len(documents)} documents, {sum(len(d['symbols']) for d in documents)} top-level symbols.")
    if errors:
        print(f"Skipped {len(errors)} files due to errors:", *errors, sep="\n")

if __name__ == "__main__":
    main()
