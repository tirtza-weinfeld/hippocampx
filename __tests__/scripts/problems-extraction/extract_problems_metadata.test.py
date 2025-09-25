import pytest
import json
from pathlib import Path
import sys
import tempfile
import os

# Add the backend directory to the path
backend_path = str(Path(__file__).parent.parent.parent / "backend")
sys.path.insert(0, backend_path)

from scripts.problems.extract_problems_metadata import (
    extract_function_metadata,
    process_python_file,
    main
)


def test_extract_function_metadata():
    """Test extraction of metadata from a function with complete docstring."""
    docstring = '''
    Definition:
      - Binary Tree Level Order Traversal
      - Given the root of a binary tree, return its nodes' values organized by level, from left to right.
     
    Leetcode: 
      - [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

    Insight:
      - the core logic hinges on the inner `for` loop. The expression `len(queue)`
   takes a *"snapshot"* of the number of nodes on the current level before the loop begins.

    Time Complexity:
      - O(N)
      - where N is the total number of nodes in the tree.

    Topics: 
      - BFS

    Difficulty: 
      - medium
    '''
    
    result = extract_function_metadata("levelOrder", docstring)
    
    assert result["name"] == "levelOrder"
    assert "Binary Tree Level Order Traversal" in result["definition"]
    assert "[102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)" in result["leetcode"]
    assert any("snapshot" in line for line in result["insight"])
    assert "O(N)" in result["time_complexity"]
    assert result["topics"] == ["BFS"]
    assert result["difficulty"] == "medium"


def test_extract_function_metadata_minimal():
    """Test extraction with minimal docstring."""
    docstring = '''
    Definition:
      - Simple problem

    Topics: 
      - Array
    '''
    
    result = extract_function_metadata("simpleFunc", docstring)
    
    assert result["name"] == "simpleFunc"
    assert "Simple problem" in result["definition"]
    assert result["topics"] == ["Array"]
    assert result["leetcode"] == []
    assert result["difficulty"] == ""


def test_extract_function_metadata_multiple_topics():
    """Test extraction with multiple topics."""
    docstring = '''
    Definition:
      - Multi-topic problem

    Topics: 
      - BFS
      - Graph
      - Dynamic Programming
    '''
    
    result = extract_function_metadata("multiFunc", docstring)
    
    assert result["topics"] == ["BFS", "Graph", "Dynamic Programming"]


def test_process_python_file():
    """Test processing a complete Python file."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write('''
def levelOrder(root):
    """
    Definition:
      - Binary Tree Level Order Traversal
     
    Leetcode: 
      - [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

    Topics: 
      - BFS

    Difficulty: 
      - medium
    """
    pass

def numIslands(grid):
    """
    Definition:
      - Number of Islands

    Topics: 
      - BFS

    Difficulty: 
      - medium
    """
    pass

def helper_function():
    """Just a helper function without problem metadata."""
    pass
''')
        f.flush()
        
        try:
            result = process_python_file(f.name)
            
            assert len(result) == 2  # Only functions with problem metadata
            
            level_order = next(f for f in result if f["name"] == "levelOrder")
            assert "Binary Tree Level Order Traversal" in level_order["definition"]
            assert level_order["difficulty"] == "medium"
            
            num_islands = next(f for f in result if f["name"] == "numIslands")
            assert "Number of Islands" in num_islands["definition"]
            
        finally:
            os.unlink(f.name)


def test_main_integration():
    """Test the main function with a temporary directory structure."""
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create algorithms directory
        algorithms_dir = Path(temp_dir) / "algorithms"
        algorithms_dir.mkdir()
        
        # Create a test Python file
        test_file = algorithms_dir / "test_algorithms.py"
        test_file.write_text('''
def testFunc(x):
    """
    Definition:
      - Test Problem
     
    Topics: 
      - Array

    Difficulty: 
      - easy
    """
    return x
''')
        
        # Create output directory
        output_dir = Path(temp_dir) / "output"
        output_dir.mkdir()
        
        # Run main function
        main(str(algorithms_dir), str(output_dir / "problems_metadata.json"))
        
        # Verify output
        output_file = output_dir / "problems_metadata.json"
        assert output_file.exists()
        
        with open(output_file) as f:
            data = json.load(f)
            
        assert len(data) == 1
        assert data[0]["name"] == "testFunc"
        assert "Test Problem" in data[0]["definition"]
        assert data[0]["difficulty"] == "easy"


def test_empty_docstring():
    """Test function with empty or no docstring."""
    result = extract_function_metadata("emptyFunc", "")
    assert result is None
    
    result = extract_function_metadata("emptyFunc", None)
    assert result is None


def test_docstring_without_definition():
    """Test docstring without Definition section."""
    docstring = '''
    This is just a regular docstring without problem metadata.
    
    Args:
        x: Some parameter
        
    Returns:
        Some value
    '''
    
    result = extract_function_metadata("regularFunc", docstring)
    assert result is None