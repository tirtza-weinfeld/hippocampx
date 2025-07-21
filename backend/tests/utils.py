"""Utility functions for testing."""

import tempfile
import textwrap
from pathlib import Path
from typing import Any, Dict, List


def create_temp_python_file(
    content: str, 
    suffix: str = ".py", 
    cleanup: bool = False
) -> Path:
    """Create a temporary Python file with the given content.
    
    Args:
        content: Python code content
        suffix: File suffix (default: .py)
        cleanup: Whether to auto-cleanup (default: False)
        
    Returns:
        Path to the temporary file
    """
    if cleanup:
        # Use NamedTemporaryFile for auto-cleanup
        temp_file = tempfile.NamedTemporaryFile(
            mode='w', 
            suffix=suffix, 
            delete=False
        )
    else:
        # Create in temp directory manually
        temp_file = tempfile.NamedTemporaryFile(
            mode='w', 
            suffix=suffix, 
            delete=False
        )
    
    temp_file.write(textwrap.dedent(content))
    temp_file.flush()
    temp_file.close()
    
    return Path(temp_file.name)


def assert_dict_subset(subset: Dict[str, Any], full_dict: Dict[str, Any]) -> None:
    """Assert that subset is a subset of full_dict."""
    for key, value in subset.items():
        assert key in full_dict, f"Key '{key}' not found in {list(full_dict.keys())}"
        if isinstance(value, dict) and isinstance(full_dict[key], dict):
            assert_dict_subset(value, full_dict[key])
        else:
            assert full_dict[key] == value, f"Value mismatch for '{key}': expected {value}, got {full_dict[key]}"


def assert_valid_python_code(code: str) -> None:
    """Assert that the given string is valid Python code."""
    import ast
    try:
        ast.parse(code)
    except SyntaxError as e:
        raise AssertionError(f"Invalid Python code: {e}\n{code}") from e


def count_code_lines(code: str, ignore_empty: bool = True) -> int:
    """Count lines of code, optionally ignoring empty lines."""
    lines = code.splitlines()
    if ignore_empty:
        lines = [line for line in lines if line.strip()]
    return len(lines)


def extract_function_names(code: str) -> List[str]:
    """Extract function names from Python code."""
    import ast
    
    tree = ast.parse(code)
    function_names = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            function_names.append(node.name)
    
    return function_names


def extract_class_names(code: str) -> List[str]:
    """Extract class names from Python code."""
    import ast
    
    tree = ast.parse(code)
    class_names = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            class_names.append(node.name)
    
    return class_names


class MockPath:
    """Mock Path object for testing."""
    
    def __init__(self, path_str: str, exists: bool = True, is_file: bool = True):
        self.path_str = path_str
        self._exists = exists
        self._is_file = is_file
    
    def __str__(self) -> str:
        return self.path_str
    
    def exists(self) -> bool:
        return self._exists
    
    def is_file(self) -> bool:
        return self._is_file
    
    def read_text(self) -> str:
        if not self._exists:
            raise FileNotFoundError(f"No such file: '{self.path_str}'")
        return f"# Mock content for {self.path_str}"
    
    def suffix(self) -> str:
        return Path(self.path_str).suffix
    
    def stem(self) -> str:
        return Path(self.path_str).stem
    
    def parent(self) -> Path:
        return Path(self.path_str).parent


def create_sample_algorithm_file(
    filename: str = "sample_algorithm.py",
    functions: List[str] = None
) -> str:
    """Create sample algorithm file content for testing."""
    if functions is None:
        functions = ["binary_search", "quick_sort"]
    
    content = f'"""Sample algorithm module: {filename}"""\n\n'
    
    for func in functions:
        content += f'''
def {func}(arr, target):
    """Sample {func} implementation.
    
    Args:
        arr: Input array
        target: Target value
        
    Returns:
        Result of {func}
    """
    # Implementation would go here
    pass

'''
    
    return content


def normalize_whitespace(text: str) -> str:
    """Normalize whitespace in text for comparison."""
    return " ".join(text.split())