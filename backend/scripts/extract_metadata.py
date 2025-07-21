#!/usr/bin/env python3
"""
Extract symbol metadata from source files for use with code-tooltip plugin.

This script scans source files and extracts metadata about functions, classes, and methods,
outputting a standardized JSON format that can be consumed by frontend tools.
"""

import ast
import argparse
import json
import logging
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple, Union


class PythonExtractor:
    """Extract metadata from Python source files."""
    
    def __init__(self):
        self.symbols: Dict[str, Dict[str, Any]] = {}
    
    def extract_from_file(self, file_path: Path, project_root: Path) -> Dict[str, Dict[str, Any]]:
        """Extract all symbols from a Python file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            # Calculate relative path properly
            try:
                relative_path = str(file_path.relative_to(project_root))
            except ValueError:
                # If file_path is not relative to project_root, use the absolute path
                relative_path = str(file_path)
            
            # Extract top-level functions and classes
            for node in tree.body:
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    symbol_data = self._extract_symbol(node, content, relative_path)
                    if symbol_data:
                        self.symbols[symbol_data['name']] = symbol_data
                elif isinstance(node, ast.ClassDef):
                    class_symbol = self._extract_symbol(node, content, relative_path)
                    if class_symbol:
                        self.symbols[class_symbol['name']] = class_symbol
                    # Extract methods inside the class
                    for item in node.body:
                        if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                            method_symbol = self._extract_symbol(item, content, relative_path, parent=node.name)
                            if method_symbol:
                                # Use ClassName.method_name as key
                                key = f"{node.name}.{item.name}"
                                self.symbols[key] = method_symbol
            
            return self.symbols
            
        except Exception as e:
            logging.warning(f"Failed to parse {file_path}: {e}")
            return {}
    
    def _extract_symbol(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef], 
                       content: str, file_path: str, parent: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Extract metadata for a single symbol."""
        try:
            name = node.name
            if isinstance(node, ast.ClassDef):
                symbol_type = "class"
            elif parent:
                symbol_type = "method"
            else:
                symbol_type = "function"
            
            line = node.lineno
            signature = self._extract_signature(node, content)
            description = self._extract_description(node)
            
            # Extract parameters and return type for functions/methods
            parameters = []
            return_type = ""
            return_description = ""
            
            if symbol_type in ["function", "method"]:
                parameters = self._extract_parameters(node)
                return_type = self._extract_return_type(node)
                return_description = self._extract_return_description(node)
            
            if symbol_type == "class":
                code = self._extract_class_code(node, content)
            else:
                code = self._extract_clean_code(node, content)
            
            # Extract links from docstring
            links = self._extract_links(node)
            
            # Extract variables from docstring
            variables = self._extract_variables(node)
            
            # Extract expressions from docstring
            expressions = self._extract_expressions(node)
            
            symbol = {
                "name": name,
                "type": symbol_type,
                "language": "python",
                "file": file_path,
                "line": line,
                "signature": signature,
                "parameters": parameters,
                "return_type": return_type,
                "return_description": return_description,
                "description": description,
                "code": code,
                "links": links,
                "variables": variables,
                "expressions": expressions
            }
            
            if parent:
                symbol["parent"] = parent
            
            return symbol
        except Exception as e:
            logging.warning(f"Failed to extract symbol {getattr(node, 'name', 'unknown')}: {e}")
            return None
    
    def _extract_signature(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef], 
                          content: str) -> str:
        """Extract the function/class signature as a string."""
        lines = content.split('\n')
        
        # Get the definition line for functions, async functions, and classes
        def_line = lines[node.lineno - 1].strip()
        # Remove leading/trailing whitespace and comments
        def_line = re.sub(r'#.*$', '', def_line).strip()
        return def_line
    
    def _extract_parameters(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef]) -> List[Dict[str, Any]]:
        """Extract parameter information from function/method signature and docstring."""
        parameters = []
        docstring_params = self._parse_docstring_parameters(node)
        
        for arg in node.args.args:
            param_name = arg.arg
            
            # Skip 'self' parameter for methods
            if param_name == 'self':
                continue
            
            # Get type annotation
            param_type = ""
            if arg.annotation:
                param_type = self._ast_to_string(arg.annotation)
            
            # Get default value
            default_value = None
            # Find the corresponding default in node.args.defaults
            arg_index = node.args.args.index(arg)
            defaults_start = len(node.args.args) - len(node.args.defaults)
            if arg_index >= defaults_start:
                default_index = arg_index - defaults_start
                default_ast = node.args.defaults[default_index]
                default_value = self._ast_to_string(default_ast)
            
            # Get description from docstring
            param_description = docstring_params.get(param_name, "")
            
            # Only include parameters that have descriptions in the docstring
            if param_description.strip():
                parameters.append({
                    "name": param_name,
                    "type": param_type,
                    "description": param_description,
                    "default": default_value
                })
        
        return parameters
    
    def _extract_return_type(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef]) -> str:
        """Extract return type annotation from function/method signature."""
        if node.returns:
            return self._ast_to_string(node.returns)
        return ""
    
    def _extract_return_description(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef]) -> str:
        """Extract return description from docstring."""
        docstring = self._get_docstring(node)
        if not docstring:
            return ""
        
        # Parse different docstring formats for return descriptions
        return_desc = ""
        
        # Google format: Returns: or Return:
        google_match = re.search(r'Returns?:\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)', docstring, re.DOTALL | re.IGNORECASE)
        if google_match:
            return_desc = google_match.group(1).strip()
        
        # NumPy format: Returns -------
        numpy_match = re.search(r'Returns\s*[-=]+\s*(.+?)(?=\n\s*[-=]+\n|\Z)', docstring, re.DOTALL)
        if numpy_match:
            return_desc = numpy_match.group(1).strip()
        
        # reStructuredText format: :return:
        rst_match = re.search(r':return:\s*(.+?)(?=\n\s*:|\Z)', docstring, re.DOTALL)
        if rst_match:
            return_desc = rst_match.group(1).strip()
        
        return self._clean_description(return_desc)
    
    def _parse_docstring_parameters(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef]) -> Dict[str, str]:
        """Parse parameter descriptions from docstring in various formats."""
        docstring = self._get_docstring(node)
        if not docstring:
            return {}
        params = {}
        # Google format: Args: section
        args_match = re.search(r'Args:\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)', docstring, re.DOTALL)
        if args_match:
            args_section = args_match.group(1)
            # Parse individual parameters with (type): description
            param_matches = re.finditer(r'(\w+)\s*\(([^)]*)\):\s*(.+?)(?=\n\s*\w+\s*(?:\([^)]*\))?:|\Z)', args_section, re.DOTALL)
            for match in param_matches:
                param_name = match.group(1)
                param_type = match.group(2).strip()
                param_desc = match.group(3).strip()
                params[param_name] = param_desc
            # Also handle lines like 'param: description' (no type), even if indented
            fallback_matches = re.finditer(r'^\s*(\w+)\s*:\s*(.+)$', args_section, re.MULTILINE)
            for match in fallback_matches:
                param_name = match.group(1)
                param_desc = match.group(2).strip()
                if param_name not in params:
                    params[param_name] = param_desc
        # NumPy format: Parameters ----------
        params_match = re.search(r'Parameters\s*[-=]+\s*(.+?)(?=\n\s*[-=]+\n|\Z)', docstring, re.DOTALL)
        if params_match:
            params_section = params_match.group(1)
            param_matches = re.finditer(r'(\w+)\s*:\s*([^\n]+)\s*\n\s*(.+?)(?=\n\s*\w+\s*:|\Z)', params_section, re.DOTALL)
            for match in param_matches:
                param_name = match.group(1)
                param_type = match.group(2).strip()
                param_desc = match.group(3).strip()
                params[param_name] = param_desc
        # reStructuredText format: :param name: description
        rst_matches = re.finditer(r':param\s+(\w+):\s*(.+?)(?=\n\s*:|\Z)', docstring, re.DOTALL)
        for match in rst_matches:
            param_name = match.group(1)
            param_desc = match.group(2).strip()
            params[param_name] = param_desc
        return params
    
    def _get_docstring(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]) -> str:
        """Extract docstring content from a node."""
        if not node.body:
            return ""
        
        # Get the first statement in the body
        first_stmt = node.body[0]
        
        if isinstance(first_stmt, ast.Expr) and isinstance(first_stmt.value, ast.Constant):
            docstring_content = first_stmt.value.value
            if isinstance(docstring_content, str):
                return docstring_content
        
        return ""
    
    def _ast_to_string(self, node: ast.AST) -> str:
        """Convert an AST node to a string representation."""
        if node is None:
            return ""
        
        # Handle common AST node types
        if isinstance(node, ast.Name):
            return node.id
        elif isinstance(node, ast.Constant):
            if isinstance(node.value, str):
                return f"'{node.value}'"
            return str(node.value)
        elif isinstance(node, ast.List):
            elements = [self._ast_to_string(el) for el in node.elts]
            return f"[{', '.join(elements)}]"
        elif isinstance(node, ast.Tuple):
            elements = [self._ast_to_string(el) for el in node.elts]
            return f"({', '.join(elements)})"
        elif isinstance(node, ast.Dict):
            keys = [self._ast_to_string(k) for k in node.keys]
            values = [self._ast_to_string(v) for v in node.values]
            pairs = [f"{k}: {v}" for k, v in zip(keys, values)]
            return f"{{{', '.join(pairs)}}}"
        elif isinstance(node, ast.Subscript):
            value = self._ast_to_string(node.value)
            slice_val = self._ast_to_string(node.slice)
            return f"{value}[{slice_val}]"
        elif isinstance(node, ast.Attribute):
            value = self._ast_to_string(node.value)
            return f"{value}.{node.attr}"
        elif isinstance(node, ast.BinOp):
            left = self._ast_to_string(node.left)
            right = self._ast_to_string(node.right)
            op = self._get_operator(node.op)
            return f"{left} {op} {right}"
        elif isinstance(node, ast.UnaryOp):
            operand = self._ast_to_string(node.operand)
            op = self._get_unary_operator(node.op)
            return f"{op}{operand}"
        elif isinstance(node, ast.Call):
            func = self._ast_to_string(node.func)
            args = [self._ast_to_string(arg) for arg in node.args]
            return f"{func}({', '.join(args)})"
        elif isinstance(node, ast.Index):
            return self._ast_to_string(node.value)
        elif isinstance(node, ast.Slice):
            lower = self._ast_to_string(node.lower) if node.lower else ""
            upper = self._ast_to_string(node.upper) if node.upper else ""
            step = self._ast_to_string(node.step) if node.step else ""
            if step:
                return f"{lower}:{upper}:{step}"
            return f"{lower}:{upper}"
        else:
            # For complex types, try to get a reasonable string representation
            return str(node.__class__.__name__)
    
    def _get_operator(self, op: ast.operator) -> str:
        """Convert AST operator to string."""
        operators = {
            ast.Add: '+',
            ast.Sub: '-',
            ast.Mult: '*',
            ast.Div: '/',
            ast.Mod: '%',
            ast.Pow: '**',
            ast.LShift: '<<',
            ast.RShift: '>>',
            ast.BitOr: '|',
            ast.BitXor: '^',
            ast.BitAnd: '&',
            ast.FloorDiv: '//'
        }
        return operators.get(type(op), '?')
    
    def _get_unary_operator(self, op: ast.unaryop) -> str:
        """Convert AST unary operator to string."""
        operators = {
            ast.UAdd: '+',
            ast.USub: '-',
            ast.Not: 'not ',
            ast.Invert: '~'
        }
        return operators.get(type(op), '?')
    
    def _extract_description(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]) -> str:
        """Extract and clean the summary description from the docstring (first real summary line)."""
        docstring = self._get_docstring(node)
        if docstring:
            for line in docstring.strip().split('\n'):
                clean = line.strip()
                # Skip lines that are empty or start with '#'
                if clean and not clean.startswith('#'):
                    return self._clean_description(clean)
        return ""
    
    def _clean_description(self, description: str) -> str:
        """Clean description by removing line numbers and file paths."""
        # Remove common patterns that might appear in descriptions
        cleaned = description.strip()
        
        # Remove line number references like "# 1", "# 2", etc. at the beginning of lines
        cleaned = re.sub(r'^\s*#\s*\d+\s*$', '', cleaned, flags=re.MULTILINE)
        
        # Remove line number references like "# 1", "# 2", etc. at the beginning of descriptions
        cleaned = re.sub(r'^\s*#\s*\d+\s*\n', '', cleaned)
        
        # Remove file path references
        cleaned = re.sub(r'https?://[^\s]+', '', cleaned)
        
        # Clean up extra whitespace and empty lines
        cleaned = re.sub(r'\n\s*\n', '\n\n', cleaned)
        cleaned = re.sub(r'^\s+', '', cleaned, flags=re.MULTILINE)  # Remove leading whitespace
        cleaned = cleaned.strip()
        
        return cleaned
    
    def _extract_clean_code(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef], 
                           content: str) -> str:
        """Extract clean code without comments or docstrings."""
        lines = content.split('\n')
        start_line = node.lineno - 1
        end_line = node.end_lineno if hasattr(node, 'end_lineno') else start_line + 1
        code_lines = lines[start_line:end_line]
        
        # Remove docstring if present
        if node.body and isinstance(node.body[0], ast.Expr) and isinstance(node.body[0].value, ast.Constant):
            docstring_node = node.body[0]
            docstring_start = docstring_node.lineno - 1
            docstring_end = docstring_node.end_lineno if hasattr(docstring_node, 'end_lineno') else docstring_start
            # Remove docstring lines by filtering out the lines within the docstring range
            filtered_lines = []
            for i, line in enumerate(code_lines):
                absolute_line_num = start_line + i
                if absolute_line_num < docstring_start or absolute_line_num > docstring_end:
                    filtered_lines.append(line)
            code_lines = filtered_lines
        
        # Remove comments and clean up
        cleaned_lines = []
        for line in code_lines:
            # Remove inline comments
            cleaned_line = re.sub(r'#.*$', '', line)
            if cleaned_line.strip():
                cleaned_lines.append(cleaned_line)
        
        code = '\n'.join(cleaned_lines).strip()
        return code
    
    def _extract_class_code(self, node: ast.ClassDef, content: str) -> str:
        """Extract all method signatures and implementations for a class, cleaned."""
        lines = content.split('\n')
        class_start = node.lineno - 1
        class_end = node.end_lineno if hasattr(node, 'end_lineno') else class_start + 1
        class_lines = lines[class_start:class_end]
        
        # Remove all docstrings from the class code
        class_lines = self._remove_all_docstrings_from_class(node, class_lines, class_start)
        
        # Remove comments
        cleaned_lines = []
        for line in class_lines:
            cleaned_line = re.sub(r'#.*$', '', line)
            if cleaned_line.strip():  # Only keep non-empty lines
                cleaned_lines.append(cleaned_line)
        
        code = '\n'.join(cleaned_lines).strip()
        return code
    
    def _remove_all_docstrings_from_class(self, node: ast.ClassDef, class_lines: List[str], class_start: int) -> List[str]:
        """Remove all docstrings from class code, including class docstrings and method docstrings."""
        # Create a set of line numbers that contain docstrings
        docstring_lines = set()
        
        # Check for class docstring
        if node.body and isinstance(node.body[0], ast.Expr) and isinstance(node.body[0].value, ast.Constant):
            docstring_node = node.body[0]
            docstring_start = docstring_node.lineno - 1
            docstring_end = docstring_node.end_lineno if hasattr(docstring_node, 'end_lineno') else docstring_start
            for line_num in range(docstring_start, docstring_end + 1):
                docstring_lines.add(line_num)
        
        # Check for method docstrings
        for item in node.body:
            if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if item.body and isinstance(item.body[0], ast.Expr) and isinstance(item.body[0].value, ast.Constant):
                    docstring_node = item.body[0]
                    docstring_start = docstring_node.lineno - 1
                    docstring_end = docstring_node.end_lineno if hasattr(docstring_node, 'end_lineno') else docstring_start
                    for line_num in range(docstring_start, docstring_end + 1):
                        docstring_lines.add(line_num)
        
        # Filter out docstring lines and handle empty methods
        filtered_lines = []
        i = 0
        while i < len(class_lines):
            absolute_line_num = class_start + i
            line = class_lines[i]
            
            if absolute_line_num not in docstring_lines:
                filtered_lines.append(line)
                # Check if this is a method definition that might need a 'pass' statement
                if line.strip().startswith('def ') and line.strip().endswith(':'):
                    # Look ahead to see if there's any non-docstring content in this method
                    j = i + 1
                    has_content = False
                    method_indent = len(line) - len(line.lstrip())
                    
                    while j < len(class_lines):
                        next_line = class_lines[j]
                        next_absolute_line = class_start + j
                        
                        # If we hit a line that's not indented more than the method, we're done with this method
                        if next_line.strip() and len(next_line) - len(next_line.lstrip()) <= method_indent:
                            break
                        
                        # If this line is not a docstring and has content, the method has content
                        if next_absolute_line not in docstring_lines and next_line.strip():
                            has_content = True
                            break
                        
                        j += 1
                    
                    # If method has no content, we need to add a 'pass' statement
                    if not has_content:
                        indent = ' ' * (method_indent + 4)  # Add 4 spaces for method body
                        filtered_lines.append(f"{indent}pass")
            
            i += 1
        
        return filtered_lines
    
    def _extract_links(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]) -> List[Dict[str, str]]:
        """Extract links in the format [symbol_name#method_name] from docstring."""
        docstring = self._get_docstring(node)
        if not docstring:
            return []
        
        links = []
        # Pattern to match [symbol_name#method_name] or [symbol_name]
        link_pattern = r'\[([a-zA-Z_][a-zA-Z0-9_]*)(?:#([a-zA-Z_][a-zA-Z0-9_]*))?\]'
        
        matches = re.finditer(link_pattern, docstring)
        for match in matches:
            symbol_name = match.group(1)
            method_name = match.group(2) if match.group(2) else None
            
            link_info = {
                "symbol": symbol_name,
                "display": match.group(0)  # The full matched text like [prefix_sum#maxSubArrayLen]
            }
            
            if method_name:
                link_info["method"] = method_name
                link_info["target"] = f"{symbol_name}.{method_name}"
            else:
                link_info["target"] = symbol_name
            
            links.append(link_info)
        
        return links
    
    def _extract_variables(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]) -> List[Dict[str, str]]:
        """Extract variables ONLY from a Variables: section in the docstring."""
        docstring = self._get_docstring(node)
        if not docstring:
            return []
        
        variables = []
        # Pattern to match "Variables:" section with variable descriptions
        # Matches formats like:
        # Variables:
        #     - pq:  Priority queue stores (max_effort_on_path, r, c)
        #     - resolved: set to store the positions that have been resolved
        variables_section_pattern = r'Variables?:\s*\n((?:\s*[-*]\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*[^\n]+\n?)*)'
        
        variables_match = re.search(variables_section_pattern, docstring, re.IGNORECASE | re.MULTILINE)
        if variables_match:
            variables_section = variables_match.group(1)
            
            # Parse individual variable entries
            # Pattern to match: "- variable_name: description"
            variable_entry_pattern = r'^\s*[-*]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)$'
            
            for line in variables_section.split('\n'):
                line = line.strip()
                if not line:
                    continue
                entry_match = re.match(variable_entry_pattern, line)
                if entry_match:
                    variable_name = entry_match.group(1)
                    description = entry_match.group(2).strip()
                    variable_info = {
                        "name": variable_name,
                        "description": description,
                        "type": "variable"
                    }
                    variables.append(variable_info)
        return variables

    def _extract_expressions(self, node: Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]) -> List[Dict[str, str]]:
        """Extract expressions ONLY from an Expressions: section in the docstring."""
        docstring = self._get_docstring(node)
        if not docstring:
            return []
        
        expressions = []
        # Pattern to match "Expressions:" section with expression descriptions
        # Matches formats like:
        # Expressions:
        #     - '(lo + hi) // 2': round down to the nearest integer
        #     - 'a[mid] < x': check if middle element is less than target
        expressions_section_pattern = r'Expressions?:\s*\n((?:\s*[-*]\s*\'[^\']+\'\s*:\s*[^\n]+\n?)*)'
        
        expressions_match = re.search(expressions_section_pattern, docstring, re.IGNORECASE | re.MULTILINE)
        if expressions_match:
            expressions_section = expressions_match.group(1)
            
            # Parse individual expression entries
            # Pattern to match: "- 'expression': description"
            expression_entry_pattern = r'^\s*[-*]\s*\'([^\']+)\'\s*:\s*(.+)$'
            
            for line in expressions_section.split('\n'):
                line = line.strip()
                if not line:
                    continue
                entry_match = re.match(expression_entry_pattern, line)
                if entry_match:
                    expression_text = entry_match.group(1)
                    description = entry_match.group(2).strip()
                    expression_info = {
                        "expression": expression_text,
                        "description": description,
                        "type": "expression"
                    }
                    expressions.append(expression_info)
        return expressions


class MetadataExtractor:
    """Main extractor class that coordinates extraction across different languages."""
    
    def __init__(self):
        self.extractors = {
            '.py': PythonExtractor(),
            # Future: Add more language extractors here
            # '.ts': TypeScriptExtractor(),
            # '.js': JavaScriptExtractor(),
        }
        self.all_symbols: Dict[str, Dict[str, Any]] = {}
    
    def extract_from_directory(self, directory: Path, project_root: Path, 
                             extensions: Optional[Set[str]] = None) -> Dict[str, Dict[str, Any]]:
        """Extract metadata from all files in a directory."""
        if extensions is None:
            extensions = set(self.extractors.keys())
        
        for file_path in directory.rglob('*'):
            if file_path.is_file() and file_path.suffix in extensions:
                logging.info(f"Processing {file_path}")
                extractor = self.extractors[file_path.suffix]
                symbols = extractor.extract_from_file(file_path, project_root)
                self.all_symbols.update(symbols)
        
        # Validate links after all symbols are extracted
        self._validate_links()
        
        return self.all_symbols
    
    def extract_from_files(self, files: List[Path], project_root: Path) -> Dict[str, Dict[str, Any]]:
        """Extract metadata from specific files."""
        for file_path in files:
            if file_path.suffix in self.extractors:
                logging.info(f"Processing {file_path}")
                extractor = self.extractors[file_path.suffix]
                symbols = extractor.extract_from_file(file_path, project_root)
                self.all_symbols.update(symbols)
        
        # Validate links after all symbols are extracted
        self._validate_links()
        
        return self.all_symbols
    
    def _validate_links(self) -> None:
        """Validate all extracted links against the actual symbols."""
        available_symbols = set(self.all_symbols.keys())
        
        for symbol_name, symbol_data in self.all_symbols.items():
            if 'links' in symbol_data:
                for link in symbol_data['links']:
                    target = link.get('target', '')
                    
                    # Check if the target symbol exists
                    if target in available_symbols:
                        link['valid'] = True
                        link['target_symbol'] = self.all_symbols[target]
                    else:
                        link['valid'] = False
                        link['target_symbol'] = None
                        logging.warning(f"Invalid link in {symbol_name}: {link['display']} -> {target} (not found)")
    
    def save_metadata(self, output_path: Path) -> None:
        """Save the extracted metadata to a JSON file."""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.all_symbols, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Saved {len(self.all_symbols)} symbols to {output_path}")


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Extract symbol metadata from source files for code-tooltip plugin"
    )
    parser.add_argument(
        '--dirs', 
        nargs='+', 
        help='Directories to scan for source files'
    )
    parser.add_argument(
        '--files', 
        nargs='+', 
        help='Specific files to process'
    )
    parser.add_argument(
        '--out', 
        default='lib/extracted-metadata/code_metadata.json',
        help='Output JSON file path (default: lib/extracted-metadata/code_metadata.json)'
    )
    parser.add_argument(
        '--extensions', 
        nargs='+', 
        default=['.py'],
        help='File extensions to process (default: .py)'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(levelname)s: %(message)s')
    
    # Validate arguments
    if not args.dirs and not args.files:
        logging.error("Must specify either --dirs or --files")
        sys.exit(1)
    
    # Get project root (assume we're running from project root)
    project_root = Path.cwd()
    
    # Create output directory if it doesn't exist
    output_path = Path(args.out)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Initialize extractor
    extractor = MetadataExtractor()
    
    # Process directories
    if args.dirs:
        extensions = set(args.extensions)
        for directory in args.dirs:
            dir_path = Path(directory).resolve()
            if not dir_path.exists():
                logging.warning(f"Directory {directory} does not exist, skipping")
                continue
            
            logging.info(f"Scanning directory: {directory}")
            extractor.extract_from_directory(dir_path, project_root, extensions)
    
    # Process specific files
    if args.files:
        file_paths = [Path(f).resolve() for f in args.files]
        for file_path in file_paths:
            if not file_path.exists():
                logging.warning(f"File {file_path} does not exist, skipping")
                continue
        
        extractor.extract_from_files(file_paths, project_root)
    
    # Save metadata
    extractor.save_metadata(output_path)
    
    logging.info(f"Extraction complete. Found {len(extractor.all_symbols)} symbols.")


if __name__ == '__main__':
    main()