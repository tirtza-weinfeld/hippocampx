#!/usr/bin/env python3
"""
Shared docstring parsing utilities for extracting structured sections.

This module provides utilities for parsing Google-style docstrings with sections like:
Args, Returns, Raises, Examples, Topics, Difficulty, Time Complexity, Space Complexity, etc.

Used by both generate_symbol_tags.py and extract_problems_metadata.py.
"""

import ast
from typing import Any, Optional


# Section configuration mapping
_SECTION_CONFIG = {
    "Args": {"output_key": "args", "type": "args_lsp"},
    "Returns": {"output_key": "returns", "type": "returns_lsp"},
    "Examples": {"output_key": "examples", "type": "block"},
    "Raises": {"output_key": "raises", "type": "bullet_list"},
    "Topics": {"output_key": "topics", "type": "comma_list"},
    "Difficulty": {"output_key": "difficulty", "type": "block"},
    "Time Complexity": {"output_key": "time_complexity", "type": "block"},
    "Space Complexity": {"output_key": "space_complexity", "type": "block"},
    # Additional recognized sections
    "Title": {"output_key": "title", "type": "block"},
    "Leetcode": {"output_key": "leetcode", "type": "block"},
    "Definition": {"output_key": "definition", "type": "block"},
    "Intuition": {"output_key": "intuition", "type": "block"},
    "Tip": {"output_key": "tip", "type": "block"},
    "Note": {"output_key": "note", "type": "block"},
    "Variables": {"output_key": "variables", "type": "variables_dict"},
    "Expressions": {"output_key": "expressions", "type": "expressions_dict"},
    "Instance Attributes": {"output_key": "instance_attributes", "type": "variables_dict"},
    "Class Attributes": {"output_key": "class_attributes", "type": "variables_dict"},
}

# Generate section heads dynamically
_SECTION_HEADS = tuple(_SECTION_CONFIG.keys())


def _process_comma_list(lines: list[str]) -> list[str]:
    """Process lines as comma-separated list, handling bullets."""
    items: list[str] = []
    for raw in lines:
        s = raw.lstrip()
        if s[:1] in "-•*":
            s = s[1:].lstrip()
        for part in s.split(","):
            tok = part.strip()
            if tok:
                items.append(tok)
    return items


def _process_bullet_list(lines: list[str]) -> list[str]:
    """Process lines as bullet list, stripping bullet markers."""
    items: list[str] = []
    for raw in lines:
        s = raw.lstrip()
        if s[:1] in "-•*":
            s = s[1:].lstrip()
        items.append(s)
    return items


def _process_string(lines: list[str]) -> str:
    """Return first non-empty line as string."""
    return lines[0].strip()


def _process_block(lines: list[str]) -> str:
    """Return all lines joined, preserving relative indentation."""
    if not lines:
        return ""
    
    # Find the minimum indentation of non-empty lines
    non_empty_lines = [line for line in lines if line.strip()]
    if not non_empty_lines:
        return ""
    
    min_indent = min(len(line) - len(line.lstrip()) for line in non_empty_lines)
    
    # Remove the common minimum indentation from all lines
    normalized_lines = []
    for line in lines:
        if line.strip():  # Non-empty line
            # Remove the minimum indentation
            if len(line) >= min_indent:
                normalized_lines.append(line[min_indent:])
            else:
                # Line has less indentation than minimum (shouldn't happen but handle it)
                normalized_lines.append(line.lstrip())
        else:
            # Empty line - keep as empty
            normalized_lines.append("")
    
    return "\n".join(normalized_lines).strip()


def _process_args_dict(lines: list[str]) -> dict[str, str]:
    """Parse args into parameter name -> description mapping."""
    result: dict[str, str] = {}
    for raw in lines:
        line = raw.strip()
        if ':' in line:
            param, desc = line.split(':', 1)
            result[param.strip()] = desc.strip()
        # Skip lines without colons (malformed)
    return result


def _process_args_lsp(lines: list[str], node: ast.AST | None = None) -> dict[str, dict[str, str]]:
    """Parse args into LSP-style entries with label and documentation."""
    # Extract documentation from docstring lines
    doc_map: dict[str, str] = {}
    for raw in lines:
        line = raw.strip()
        if ':' in line:
            param, desc = line.split(':', 1)
            doc_map[param.strip()] = desc.strip()
    
    # Extract type annotations from AST node
    type_map: dict[str, str] = {}
    if node and isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        for arg in node.args.args:
            param_name = arg.arg
            if arg.annotation:
                try:
                    type_map[param_name] = ast.unparse(arg.annotation)
                except Exception:
                    # Fallback if unparse fails
                    pass
    
    # Get all parameter names from both sources
    all_params = set(doc_map.keys()) | set(type_map.keys())
    
    # Build LSP-style result
    result: dict[str, dict[str, str]] = {}
    for param in all_params:
        entry: dict[str, str] = {}
        if param in type_map:
            entry["label"] = type_map[param]
        if param in doc_map:
            entry["documentation"] = doc_map[param]
        result[param] = entry
    
    return result


def _process_returns_lsp(lines: list[str], node: ast.AST | None = None) -> dict[str, str]:
    """Parse returns into LSP-style entry with label and documentation."""
    entry: dict[str, str] = {}
    
    # Extract documentation from docstring lines
    if lines:
        doc_content = "\n".join(lines).strip()
        if doc_content:
            entry["documentation"] = doc_content
    
    # Extract return type annotation from AST node
    if node and isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        if node.returns:
            try:
                entry["label"] = ast.unparse(node.returns)
            except Exception:
                # Fallback if unparse fails
                pass
    
    return entry


def _process_variables_dict(lines: list[str]) -> dict[str, str]:
    """Parse variables into variable name -> description mapping."""
    result: dict[str, str] = {}
    for raw in lines:
        line = raw.strip()
        if ':' in line:
            var, desc = line.split(':', 1)
            result[var.strip()] = desc.strip()
        # Skip lines without colons (malformed)
    return result


def _process_expressions_dict(lines: list[str]) -> dict[str, str]:
    """Parse expressions into quoted expression -> description mapping with multi-line support."""
    result: dict[str, str] = {}
    i = 0
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        # Skip empty lines
        if not line.strip():
            i += 1
            continue
            
        # Look for expression lines (wrapped in single quotes)
        stripped_line = line.strip()
        if stripped_line.startswith("'") and "': " in stripped_line:
            # Find the closing quote followed by ': '
            quote_end = stripped_line.find("': ", 1)
            if quote_end != -1:
                expr_part = stripped_line[:quote_end + 1]  # Include closing quote
                desc_part = stripped_line[quote_end + 3:]  # Skip "': "
                expr_clean = expr_part.strip().strip("'\"")

                # Start building the description
                description_lines = [desc_part.strip()] if desc_part.strip() else []
            else:
                # Fallback - skip this line
                i += 1
                continue
        elif ':' in line:
            # Fallback for non-quoted expressions
            expr_part, desc_part = line.split(':', 1)
            expr_clean = expr_part.strip().strip("'\"")

            # Start building the description
            description_lines = [desc_part.strip()] if desc_part.strip() else []
        else:
            # Line without proper format, skip it
            i += 1
            continue

        # Get base indentation level for this expression
        base_indent = len(line) - len(line.lstrip())

        # Look ahead for continuation lines (more indented)
        i += 1
        while i < len(lines):
            next_line = lines[i].rstrip()

            # Empty line - include it and continue
            if not next_line.strip():
                description_lines.append("")
                i += 1
                continue

            next_indent = len(next_line) - len(next_line.lstrip())

            # If this line is more indented than the base expression, it belongs to this expression
            if next_indent > base_indent:
                description_lines.append(next_line)
                i += 1
            else:
                # This line is at the same level or less indented, so it's a new expression or end
                break

        # Join all description lines and store
        full_description = '\n'.join(description_lines).strip()
        if full_description:
            result[expr_clean] = full_description
    
    return result


def process_line_continuations(doc: str) -> str:
    """Process backslash line continuations in docstring."""
    if not doc:
        return doc
        
    lines = doc.splitlines()
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        # Check if line ends with backslash (continuation)
        if line.endswith('\\'):
            # Start building continued line - strip the backslash
            continued_line = line[:-1].rstrip()
            i += 1
            
            # Collect continuation lines
            while i < len(lines):
                next_line = lines[i]  # Keep original line with indentation
                next_line_stripped = next_line.rstrip()
                
                # If next line also ends with backslash, continue collecting
                if next_line_stripped.endswith('\\'):
                    # Join with single space, preserving the content after stripping leading whitespace
                    continued_line += ' ' + next_line.lstrip()[:-1].rstrip()
                    i += 1
                else:
                    # Last continuation line - join with single space
                    continued_line += ' ' + next_line.lstrip()
                    i += 1
                    break
            
            result_lines.append(continued_line)
        else:
            # Regular line, keep as-is
            result_lines.append(line)
            i += 1
    
    return '\n'.join(result_lines)


def parse_sections(doc: str, node: ast.AST | None = None) -> dict[str, Any]:
    """Best-effort parse of Google-style sections into structured fields."""
    if not doc:
        return {}
    
    # Process line continuations first
    processed_doc = process_line_continuations(doc)
    lines = [ln.rstrip() for ln in processed_doc.splitlines()]
    section = "summary"
    buckets: dict[str, list[str]] = {k: [] for k in ("summary", *_SECTION_HEADS)}
    for ln in lines:
        s = ln.strip()
        if s.endswith(":") and s[:-1] in _SECTION_HEADS:
            section = s[:-1]
            continue
        buckets[section].append(ln)

    out: dict[str, Any] = {}

    # Summary (first non-empty paragraph)
    summary = "\n".join([ln for ln in buckets["summary"] if ln.strip()])
    if summary:
        out["summary"] = summary

    # Process configured sections
    processors = {
        "comma_list": _process_comma_list,
        "bullet_list": _process_bullet_list,
        "string": _process_string,
        "block": _process_block,
        "args_dict": _process_args_dict,
        "variables_dict": _process_variables_dict,
        "expressions_dict": _process_expressions_dict,
        "args_lsp": _process_args_lsp,
        "returns_lsp": _process_returns_lsp,
    }
    
    # Processors that need AST node
    lsp_processors = {"args_lsp", "returns_lsp"}

    # Process sections using unified config
    for section_header, config in _SECTION_CONFIG.items():
        output_key = config["output_key"]
        processor_type = config["type"]
        
        # Skip sections that are not processed (recognized but ignored)
        if output_key is None or processor_type is None:
            continue
            
        processor = processors.get(processor_type)
        if not processor:
            continue
            
        # Get lines for this section
        if processor_type == "block":
            # For block type, include all lines (even empty ones for formatting)
            lines = buckets[section_header]
            if any(ln.strip() for ln in lines):
                result = processor(lines)
                if result:
                    out[output_key] = result
        else:
            # For other types, filter out empty lines
            lines = [ln for ln in buckets[section_header] if ln.strip()]
            
            # For LSP processors, always call even with empty lines (they can extract from AST)
            if processor_type in lsp_processors:
                result = processor(lines, node)
                if result:
                    out[output_key] = result
            elif lines:
                # For non-LSP processors, only call if there are lines
                result = processor(lines)
                if result:
                    out[output_key] = result

    return out


def extract_metadata(raw_doc: str, node: ast.AST | None = None) -> dict[str, Any]:
    """Parse Google-style sections from docstring."""
    return parse_sections(raw_doc or "", node)