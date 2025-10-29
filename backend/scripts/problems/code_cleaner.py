#!/usr/bin/env python3
"""
Shared code cleaning utilities for consistent snippet processing.

This module provides a standardized way to clean Python code by removing
docstrings and comments, ensuring that both metadata extraction and usage
analysis work on identical code snippets.
"""


def remove_comments_from_lines(
    lines: list[str],
    remove_end_of_line: bool,
    remove_full_line: bool
) -> list[str]:
    """Remove comments from lines while preserving strings.

    Args:
        lines: List of code lines
        remove_end_of_line: Remove end-of-line comments (default: True)
        remove_full_line: Remove full-line comments (default: False)

    Returns:
        List of lines with comments removed based on settings
    """
    clean_lines = []

    for line in lines:
        stripped = line.strip()

        # Check if this is a full-line comment
        if stripped.startswith('#'):
            if remove_full_line:
                # Skip this line entirely
                continue
            else:
                # Keep the full-line comment
                clean_lines.append(line)
                continue

        # Handle end-of-line comments
        cleaned_line = line
        if remove_end_of_line and '#' in line:
            # Find # not in quotes
            in_string = False
            quote_char = None
            for j, char in enumerate(line):
                if char in ['"', "'"] and (j == 0 or line[j-1] != '\\'):
                    if not in_string:
                        in_string = True
                        quote_char = char
                    elif char == quote_char:
                        in_string = False
                        quote_char = None
                elif char == '#' and not in_string:
                    cleaned_line = line[:j].rstrip()
                    break

        clean_lines.append(cleaned_line)

    return clean_lines


def clean_code(
    code_text: str,
    remove_inline_end_of_line_comments = True,
    remove_inline_full_line_comments = True
) -> str:
    """Remove docstrings and optionally comments from code.

    This function ensures consistent code cleaning across all scripts.
    Used by both extract_problems_metadata.py and generate_uses.py.

    Args:
        code_text: Raw Python code text
        remove_inline_end_of_line_comments: Whether to remove end-of-line comments (default: True)
        remove_inline_full_line_comments: Whether to remove full-line comments (default: False)

    Returns:
        Cleaned code with docstrings and optionally comments removed
    """
    import ast

    try:
        # Parse the AST to identify docstrings properly
        tree = ast.parse(code_text)

        # Collect all docstring ranges
        docstring_ranges = []

        def collect_docstrings(node):
            # Check if this node has a docstring (but NOT for Module level)
            # We want to keep imports at module level, only remove function/class docstrings
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):  # Removed ast.Module
                if (hasattr(node, 'body') and node.body and
                    isinstance(node.body[0], ast.Expr) and
                    isinstance(node.body[0].value, ast.Constant) and
                    isinstance(node.body[0].value.value, str)):

                    docstring_node = node.body[0]
                    docstring_ranges.append((
                        docstring_node.lineno - 1,  # Convert to 0-based
                        docstring_node.end_lineno - 1 if docstring_node.end_lineno else docstring_node.lineno - 1
                    ))

            # Recursively check child nodes
            for child in ast.iter_child_nodes(node):
                collect_docstrings(child)

        collect_docstrings(tree)

        # STEP 1: Remove docstrings FIRST (before comment removal)
        lines = code_text.split('\n')
        lines_without_docstrings = []

        for i, line in enumerate(lines):
            is_docstring_line = any(start <= i <= end for start, end in docstring_ranges)
            if not is_docstring_line:
                lines_without_docstrings.append(line)

        # STEP 2: NOW remove comments from the docstring-free lines
        if remove_inline_end_of_line_comments or remove_inline_full_line_comments:
            lines_without_docstrings = remove_comments_from_lines(
                lines_without_docstrings,
                remove_end_of_line=remove_inline_end_of_line_comments,
                remove_full_line=remove_inline_full_line_comments
            )

        # STEP 3: Normalize consecutive newlines (3+ newlines -> 2 newlines = 1 blank line)
        clean_lines = []
        consecutive_empty = 0

        for line in lines_without_docstrings:
            if line.strip():
                clean_lines.append(line)
                consecutive_empty = 0
            else:
                consecutive_empty += 1
                # Only keep maximum 1 blank line (2 consecutive empty lines)
                if consecutive_empty <= 1:
                    clean_lines.append('')

        # Remove leading and trailing empty lines
        while clean_lines and not clean_lines[0].strip():
            clean_lines.pop(0)
        while clean_lines and not clean_lines[-1].strip():
            clean_lines.pop()

        return '\n'.join(clean_lines)
        
    except SyntaxError:
        # If parsing fails, fall back to simple line-by-line cleaning
        return _simple_clean_code(
            code_text,
            remove_inline_end_of_line_comments=remove_inline_end_of_line_comments,
            remove_inline_full_line_comments=remove_inline_full_line_comments
        )


def _simple_clean_code(
    code_text: str,
    remove_inline_end_of_line_comments,
    remove_inline_full_line_comments
) -> str:
    """Fallback simple cleaning when AST parsing fails.

    Args:
        code_text: Raw Python code text
        remove_inline_end_of_line_comments: Whether to remove end-of-line comments (default: True)
        remove_inline_full_line_comments: Whether to remove full-line comments (default: False)

    Returns:
        Cleaned code with docstrings and optionally comments removed
    """
    lines = code_text.split('\n')
    clean_lines = []
    in_triple_quote = False
    quote_type = None
    
    for line in lines:
        original_line = line
        
        # Handle triple quotes more carefully
        if '"""' in line or "'''" in line:
            # Count triple quotes in the line
            triple_double = line.count('"""')
            triple_single = line.count("'''")
            
            if triple_double > 0:
                if not in_triple_quote:
                    in_triple_quote = True
                    quote_type = '"""'
                    continue
                elif quote_type == '"""':
                    in_triple_quote = False
                    quote_type = None
                    continue
            elif triple_single > 0:
                if not in_triple_quote:
                    in_triple_quote = True
                    quote_type = "'''"
                    continue
                elif quote_type == "'''":
                    in_triple_quote = False
                    quote_type = None
                    continue
        
        if in_triple_quote:
            continue

        # Check if this is a full-line comment
        stripped = line.strip()
        if stripped.startswith('#'):
            if remove_inline_full_line_comments:
                continue
            else:
                clean_lines.append(line)
                continue

        # Remove end-of-line comments if requested
        if remove_inline_end_of_line_comments and '#' in line:
            comment_pos = line.find('#')
            line = line[:comment_pos].rstrip()

        # Keep non-empty lines and preserve strategic empty lines
        if line.strip():
            clean_lines.append(line)
        elif (len(clean_lines) > 0 and original_line.strip() == '' and
              not in_triple_quote):
            # Preserve empty lines that separate logical sections
            clean_lines.append('')
    
    return '\n'.join(clean_lines)


def clean_code_for_ast_parsing(
    code_text: str,
    remove_inline_end_of_line_comments,
    remove_inline_full_line_comments
) -> tuple[str, list[int]]:
    """Clean code and return line mapping for position adjustment.

    Args:
        code_text: Raw Python code text
        remove_inline_end_of_line_comments: Whether to remove end-of-line comments (default: True)
        remove_inline_full_line_comments: Whether to remove full-line comments (default: False)

    Returns:
        Tuple of (cleaned_code, line_mapping) where line_mapping[clean_line] = original_line
    """
    lines = code_text.split('\n')
    clean_lines = []
    line_mapping = []  # Maps clean line numbers to original line numbers
    in_docstring = False
    
    for original_line_idx, line in enumerate(lines):
        stripped = line.strip()
        
        # Skip docstring lines
        if '"""' in stripped:
            if in_docstring:
                in_docstring = False
                continue
            else:
                in_docstring = True
                continue
        
        if in_docstring:
            continue

        # Check if this is a full-line comment
        if stripped.startswith('#'):
            if remove_inline_full_line_comments:
                continue
            else:
                clean_lines.append(line)
                line_mapping.append(original_line_idx)
                continue

        # Remove end-of-line comments if requested
        if remove_inline_end_of_line_comments and '#' in line:
            comment_pos = line.find('#')
            line = line[:comment_pos].rstrip()

        # Keep non-empty lines
        if line.strip():
            clean_lines.append(line)
            line_mapping.append(original_line_idx)

    return '\n'.join(clean_lines), line_mapping