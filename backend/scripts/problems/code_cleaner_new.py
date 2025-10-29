# #!/usr/bin/env python3

# import ast


# def clean_code(code_text: str) -> str:
#     """Remove all docstrings from Python code using AST traversal."""
#     try:
#         # Parse the AST
#         tree = ast.parse(code_text)

#         # Collect all docstring line ranges
#         docstring_ranges = []

#         def collect_docstrings(node):
#             # Check if this node has a docstring
#             if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.Module)):
#                 if (hasattr(node, 'body') and node.body and
#                     isinstance(node.body[0], ast.Expr) and
#                     isinstance(node.body[0].value, ast.Constant) and
#                     isinstance(node.body[0].value.value, str)):

#                     docstring_node = node.body[0]
#                     docstring_ranges.append((
#                         docstring_node.lineno - 1,  # Convert to 0-based
#                         docstring_node.end_lineno - 1 if docstring_node.end_lineno else docstring_node.lineno - 1
#                     ))

#             # Recursively check child nodes
#             for child in ast.iter_child_nodes(node):
#                 collect_docstrings(child)

#         collect_docstrings(tree)

#         # Process lines and remove docstrings
#         lines = code_text.splitlines()
#         clean_lines = []

#         for i, line in enumerate(lines):
#             # Check if this line is part of any docstring
#             is_docstring_line = any(start <= i <= end for start, end in docstring_ranges)

#             if not is_docstring_line:
#                 clean_lines.append(line)

#         return '\n'.join(clean_lines)

#     except SyntaxError:
#         # If parsing fails, return original code
#         return code_text