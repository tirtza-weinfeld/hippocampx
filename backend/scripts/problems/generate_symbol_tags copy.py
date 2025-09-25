#!/usr/bin/env python3
"""
Generate a flat `symbol_tags.json` for build-time filtering + tooltips.

Design (latest-only):
- Python 3.13.x; no __future__ imports, no typing backports.
- Emits a single JSON object keyed by qualified name (qname):
    { "<module>:<path.to.symbol>": { <metadata> }, ... }
- Metadata is data-only (no HTML). Sources:
  1) YAML front-matter in docstrings between --- lines (if present).
  2) Google-style sections in docstrings: Args, Returns, Raises, Examples,
     Topics, Difficulty, Time Complexity, Space Complexity.
  3) Optional sidecar YAML next to the source file:
     - <file>.meta.yaml — module-level defaults (merged into each symbol unless overridden)
     - <file>.<SymbolPath>.meta.yaml — symbol-specific overrides

CLI:
  python3 generate_symbol_tags.py \
    --root ../../algorithms/new \
    --out  ../../lib/extracted-metadata/symbol_tags.json

Output is stable and pretty (sorted keys).
"""

import argparse
import ast
import json
import re
import sys
from pathlib import Path

# ---------- Defaults ----------
DEFAULT_ROOT: Path = Path("../../algorithms/new")
DEFAULT_OUT: Path = Path("../../lib/extracted-metadata/symbol_tags.json")

# Optional YAML parsing (front-matter / sidecars)
try:
    import yaml  # PyYAML
except Exception:  # pragma: no cover
    yaml = None

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


# ---------- Docstring parsing ----------
_FRONT_MATTER_RE = re.compile(r"^\s*---\s*$", re.MULTILINE)
_SECTION_HEADS = (
    "Args",
    "Returns",
    "Examples",
    "Raises",

    "Title",
    "Leetcode",
    "Definition",
    "Intuition",
    "Tip",
    "Note",
    "Time Complexity",
    "Space Complexity",
    "Topics",
    "Difficulty",
    "Variables",
    "Expressions",
   

)


def _ensure_list(v: object | None) -> list[str] | None:
    if v is None:
        return None
    if isinstance(v, list):
        return [str(x) for x in v]
    if isinstance(v, str):
        items = [tok.strip() for tok in v.split(",") if tok.strip()]
        return items or [v]
    return [str(v)]


def _as_str(v: object | None) -> str | None:
    return None if v is None else str(v)


def split_front_matter(doc: str) -> tuple[dict[str, object], str]:
    """Return (front_matter, remainder). If no YAML or parse fails, front_matter = {}."""
    if not doc:
        return {}, ""
    matches = list(_FRONT_MATTER_RE.finditer(doc))
    if len(matches) >= 2 and matches[0].start() == 0:
        start = matches[0].end()
        end = matches[1].start()
        raw_yml = doc[start:end].strip()
        rest = doc[matches[1].end():].lstrip("\n")
        if yaml:
            try:
                data = yaml.safe_load(raw_yml) or {}
                norm: dict[str, object] = {}
                if isinstance(data, dict):
                    for k, v in data.items():
                        key = str(k).strip().lower().replace(" ", "_")
                        norm[key] = v
                return norm, rest
            except Exception:
                pass
        # no yaml or parse error → treat as plain doc
        return {}, doc
    return {}, doc


def parse_sections(doc: str) -> dict[str, object]:
    """Best-effort parse of Google-style sections into structured fields."""
    if not doc:
        return {}
    lines = [ln.rstrip() for ln in doc.splitlines()]
    section = "summary"
    buckets: dict[str, list[str]] = {k: [] for k in ("summary", *_SECTION_HEADS)}
    for ln in lines:
        s = ln.strip()
        if s.endswith(":") and s[:-1] in _SECTION_HEADS:
            section = s[:-1]
            continue
        buckets[section].append(ln)

    out: dict[str, object] = {}

    # Summary (first non-empty paragraph)
    summary = "\n".join([ln for ln in buckets["summary"] if ln.strip()])
    if summary:
        out["summary"] = summary

    # Args → list[str]
    args_lines = [ln for ln in buckets["Args"] if ln.strip()]
    if args_lines:
        items: list[str] = []
        for raw in args_lines:
            s = raw.lstrip()
            if s[:1] in "-•*":
                s = s[1:].lstrip()
            items.append(s)
        out["args"] = items

    # Returns (str)
    ret_lines = [ln for ln in buckets["Returns"] if ln.strip()]
    if ret_lines:
        out["returns"] = "\n".join(ret_lines).strip()

    # Raises (list[str])
    raise_lines = [ln for ln in buckets["Raises"] if ln.strip()]
    if raise_lines:
        items: list[str] = []
        for raw in raise_lines:
            s = raw.lstrip()
            if s[:1] in "-•*":
                s = s[1:].lstrip()
            items.append(s)
        out["raises"] = items

    # Examples (block str)
    ex_lines = [ln for ln in buckets["Examples"]]
    if any(ln.strip() for ln in ex_lines):
        out["examples"] = "\n".join(ex_lines).strip()

    # Topics (list[str])
    topics_lines = [ln for ln in buckets["Topics"] if ln.strip()]
    if topics_lines:
        items: list[str] = []
        for raw in topics_lines:
            s = raw.lstrip()
            if s[:1] in "-•*":
                s = s[1:].lstrip()
            for part in s.split(","):
                tok = part.strip()
                if tok:
                    items.append(tok)
        if items:
            out["topics"] = items

    # Difficulty (str)
    diff_lines = [ln for ln in buckets["Difficulty"] if ln.strip()]
    if diff_lines:
        out["difficulty"] = diff_lines[0].strip()

    # Time/Space Complexity (str)
    tc_lines = [ln for ln in buckets["Time Complexity"] if ln.strip()]
    if tc_lines:
        out["time_complexity"] = tc_lines[0].strip()

    sc_lines = [ln for ln in buckets["Space Complexity"] if ln.strip()]
    if sc_lines:
        out["space_complexity"] = sc_lines[0].strip()

    return out


def extract_metadata(raw_doc: str) -> dict[str, object]:
    """Merge YAML front-matter + sections. Section values override front-matter."""
    fm, rest = split_front_matter(raw_doc or "")
    sec = parse_sections(rest)
    merged: dict[str, object] = {}

    def put(key: str, val: object | None) -> None:
        if val is None:
            return
        if isinstance(val, str) and not val.strip():
            return
        if isinstance(val, list) and not val:
            return
        merged[key] = val

    # front-matter (normalized keys)
    put("topics", _ensure_list(fm.get("topics")))
    put("difficulty", _as_str(fm.get("difficulty")))
    put("time_complexity", _as_str(fm.get("time_complexity") or fm.get("time_complexity:")))
    put("space_complexity", _as_str(fm.get("space_complexity") or fm.get("space_complexity:")))

    # sections (override)
    for k in ("summary", "args", "returns", "raises", "examples",
              "topics", "difficulty", "time_complexity", "space_complexity"):
        put(k, sec.get(k))

    return merged


# ---------- AST walk / qname ----------

def walk_symbols(mod: str, tree: ast.AST) -> list[tuple[str, ast.AST]]:
    """Return (qname, node) for classes, functions (incl. nested) and methods."""
    out: list[tuple[str, ast.AST]] = []

    def visit(body: list[ast.stmt], qual: list[str]) -> None:
        for node in body:
            if isinstance(node, ast.ClassDef):
                q = f"{mod}:{'.'.join(qual+[node.name]) if qual else node.name}"
                out.append((q, node))
                visit(node.body, qual + [node.name])
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                q = f"{mod}:{'.'.join(qual+[node.name]) if qual else node.name}"
                out.append((q, node))
                visit(node.body, qual + [node.name])
            # skip others

    visit(getattr(tree, "body", []), [])
    return out


# ---------- Sidecar YAML (optional) ----------

def load_sidecar_for(file: Path, symbol_path: str | None = None) -> dict[str, object]:
    """
    Load sidecar YAML next to `file`.
    - <file>.meta.yaml applies to all symbols in that file (module-level defaults).
    - <file>.<SymbolPath>.meta.yaml applies to a specific symbol path, where dots are kept.
      Example: utils.py.Formatter.title.meta.yaml
    Last writer wins (symbol-specific overrides module-level).
    """
    merged: dict[str, object] = {}
    if not yaml:
        return merged

    base = file.with_suffix("")  # /path/utils
    module_sidecar = base.with_suffix(".meta.yaml")  # /path/utils.meta.yaml
    if module_sidecar.exists():
        try:
            data = yaml.safe_load(module_sidecar.read_text(encoding="utf-8")) or {}
            if isinstance(data, dict):
                for k, v in data.items():
                    merged[str(k)] = v
        except Exception as e:
            print(f"[warn] sidecar parse failed: {module_sidecar}: {e}", file=sys.stderr)

    if symbol_path:
        sym_sidecar = Path(str(file) + f".{symbol_path}.meta.yaml")
        if sym_sidecar.exists():
            try:
                data = yaml.safe_load(sym_sidecar.read_text(encoding="utf-8")) or {}
                if isinstance(data, dict):
                    for k, v in data.items():
                        merged[str(k)] = v
            except Exception as e:
                print(f"[warn] sidecar parse failed: {sym_sidecar}: {e}", file=sys.stderr)

    return merged


# ---------- Builder ----------

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
        for qname, node in walk_symbols(mod, tree):
            raw = ast.get_docstring(node, clean=True) or ""
            meta = extract_metadata(raw)

            # Merge sidecars (module-level then symbol-specific)
            # symbol_path is the part after '<module>:'
            sym_path = qname.split(":", 1)[1] if ":" in qname else qname
            side_mod = load_sidecar_for(f, None)
            side_sym = load_sidecar_for(f, sym_path)

            merged: dict[str, object] = {}
            for src in (side_mod, meta, side_sym):
                for k, v in src.items():
                    # normalize a few known keys for consistency
                    kk = k.strip().lower().replace(" ", "_")
                    if kk == "topics":
                        vv = _ensure_list(v)
                        if vv:
                            merged["topics"] = vv
                    elif kk in {"difficulty", "time_complexity", "space_complexity", "summary", "returns", "examples"}:
                        sv = _as_str(v)
                        if sv:
                            merged[kk] = sv
                    elif kk == "args":
                        lv = _ensure_list(v)
                        if lv:
                            merged["args"] = lv
                    else:
                        # pass-through for custom fields (e.g., leetcode id)
                        merged[kk] = v

            if merged:
                tags[qname] = merged

    return tags


# ---------- Main ----------

def main() -> None:
    ap = argparse.ArgumentParser(description="Generate flat symbol_tags.json for tooltips/filtering (latest-only).")
    ap.add_argument("--root", type=Path, default=DEFAULT_ROOT, help=f"Workspace root (default: {DEFAULT_ROOT})")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help=f"Output JSON path (default: {DEFAULT_OUT})")
    args = ap.parse_args()

    data = build_symbol_tags(args.root)
    args.out.write_text(json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    print(f"Wrote {args.out} • {len(data)} symbols")


if __name__ == "__main__":
    main()
