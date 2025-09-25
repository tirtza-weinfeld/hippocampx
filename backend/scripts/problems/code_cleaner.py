#!/usr/bin/env python3
"""
Shared code cleaning utilities for consistent snippet processing.

This module provides a standardized way to clean Python code by removing
docstrings and comments, ensuring that both metadata extraction and usage
analysis work on identical code snippets.
"""


def remove_comments_from_lines(lines: list[str]) -> list[str]:
    """Remove comments from lines while preserving strings.
    
    Args:
        lines: List of code lines
        
    Returns:
        List of lines with comments removed
    """
    clean_lines = []
    
    for line in lines:
        # Remove comments (but preserve strings)
        cleaned_line = line
        if '#' in line:
            # Simple approach: find # not in quotes
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


def clean_code(code_text: str) -> str:
    """Remove docstrings from code.
    
    This function ensures consistent code cleaning across all scripts.
    Used by both extract_problems_metadata.py and generate_uses.py.
    
    Args:
        code_text: Raw Python code text
        
    Returns:
        Cleaned code with docstrings removed
    """
    import ast
    import re
    
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
        
        # Process lines and remove docstrings
        lines = code_text.split('\n')
        clean_lines = []
        
        for i, line in enumerate(lines):
            # Check if this line is part of a docstring
            is_docstring_line = any(start <= i <= end for start, end in docstring_ranges)
            
            if is_docstring_line:
                continue
            
            # Keep non-empty lines and preserve strategic empty lines
            if line.strip():
                clean_lines.append(line)
            elif (i > 0 and i < len(lines) - 1 and 
                  lines[i+1].strip() and  # Next line has content
                  (len(clean_lines) > 0 or lines[i-1].strip())):  # Previous line had content or we have output
                # Preserve empty lines that separate logical sections
                clean_lines.append('')
        
        return '\n'.join(clean_lines)
        
    except SyntaxError:
        # If parsing fails, fall back to simple line-by-line cleaning
        return _simple_clean_code(code_text)


def _simple_clean_code(code_text: str) -> str:
    """Fallback simple cleaning when AST parsing fails."""
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
            
        # Remove comments
        if '#' in line:
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


def clean_code_for_ast_parsing(code_text: str) -> tuple[str, list[int]]:
    """Clean code and return line mapping for position adjustment.
    
    Args:
        code_text: Raw Python code text
        
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
            
        # Remove comments
        if '#' in line:
            comment_pos = line.find('#')
            line = line[:comment_pos].rstrip()
        
        # Keep non-empty lines
        if line.strip():
            clean_lines.append(line)
            line_mapping.append(original_line_idx)
    
    return '\n'.join(clean_lines), line_mapping