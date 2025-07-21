import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from extract_metadata import PythonExtractor, MetadataExtractor

def test_extractor():
    """Test the PythonExtractor on examples/code/prefix_sum.py for correctness."""
    project_root = Path(__file__).parent.parent.parent.resolve()
    test_file = project_root / 'examples' / 'code' / 'prefix_sum.py'
    extractor = PythonExtractor()
    symbols = extractor.extract_from_file(test_file, project_root)
    max_sub = symbols.get('maxSubArrayLen')
    assert max_sub is not None, 'maxSubArrayLen not found'

    # Test code field: should not contain docstring or Args/Returns
    code = max_sub['code']
    assert '"""' not in code, 'Docstring not removed from code field'
    assert 'Args:' not in code, 'Args section not removed from code field'
    assert 'Returns:' not in code, 'Returns section not removed from code field'

    # Test parameter description
    params = {p['name']: p for p in max_sub['parameters']}
    assert 'k' in params, 'Parameter k missing'
    assert params['k']['description'].strip() != '', 'Parameter k description missing'
    assert params['k']['description'].strip() == 'Target sum.', f"Parameter k description incorrect: {params['k']['description']}"

    # Test description field
    assert max_sub['description'].strip() == 'Find the maximum length of a subarray that sums to exactly k.', f"Description incorrect: {max_sub['description']}"


def test_link_extraction():
    """Test the link extraction functionality."""
    project_root = Path(__file__).parent.parent.parent.resolve()
    test_file = project_root / 'examples' / 'code' / 'test_links.py'
    
    # Test individual extractor
    extractor = PythonExtractor()
    symbols = extractor.extract_from_file(test_file, project_root)
    
    # Test prefix_sum function links
    prefix_sum_symbol = symbols.get('prefix_sum')
    assert prefix_sum_symbol is not None, 'prefix_sum not found'
    assert 'links' in prefix_sum_symbol, 'Links field missing'
    
    links = prefix_sum_symbol['links']
    assert len(links) == 2, f'Expected 2 links, got {len(links)}'
    
    # Check first link [maxSubArrayLen]
    link1 = links[0]
    assert link1['symbol'] == 'maxSubArrayLen', f"First link symbol incorrect: {link1['symbol']}"
    assert link1['display'] == '[maxSubArrayLen]', f"First link display incorrect: {link1['display']}"
    assert link1['target'] == 'maxSubArrayLen', f"First link target incorrect: {link1['target']}"
    assert 'method' not in link1, "First link should not have method field"
    
    # Check second link [binary_search]
    link2 = links[1]
    assert link2['symbol'] == 'binary_search', f"Second link symbol incorrect: {link2['symbol']}"
    assert link2['display'] == '[binary_search]', f"Second link display incorrect: {link2['display']}"
    assert link2['target'] == 'binary_search', f"Second link target incorrect: {link2['target']}"
    
    # Test maxSubArrayLen function links
    max_sub_symbol = symbols.get('maxSubArrayLen')
    assert max_sub_symbol is not None, 'maxSubArrayLen not found'
    assert 'links' in max_sub_symbol, 'Links field missing'
    
    max_sub_links = max_sub_symbol['links']
    assert len(max_sub_links) == 3, f'Expected 3 links, got {len(max_sub_links)}'
    
    # Check that all expected links are present
    link_symbols = [link['symbol'] for link in max_sub_links]
    assert 'prefix_sum' in link_symbols, 'prefix_sum link missing'
    assert 'binary_search' in link_symbols, 'binary_search link missing'
    assert 'two_sum' in link_symbols, 'two_sum link missing'


def test_link_validation():
    """Test the link validation functionality."""
    project_root = Path(__file__).parent.parent.parent.resolve()
    test_file = project_root / 'examples' / 'code' / 'test_links.py'
    
    # Test with MetadataExtractor to validate links
    extractor = MetadataExtractor()
    symbols = extractor.extract_from_files([test_file], project_root)
    
    # Test that links are validated
    prefix_sum_symbol = symbols.get('prefix_sum')
    assert prefix_sum_symbol is not None, 'prefix_sum not found'
    
    links = prefix_sum_symbol['links']
    for link in links:
        assert 'valid' in link, 'Link validation field missing'
        assert 'target_symbol' in link, 'Link target_symbol field missing'
        
        # All links in test_links.py should be valid since they reference each other
        assert link['valid'] == True, f"Link {link['display']} should be valid"
        assert link['target_symbol'] is not None, f"Link {link['display']} should have target_symbol"


def test_class_method_links():
    """Test link extraction from class methods."""
    project_root = Path(__file__).parent.parent.parent.resolve()
    test_file = project_root / 'examples' / 'code' / 'test_links.py'
    
    extractor = MetadataExtractor()
    symbols = extractor.extract_from_files([test_file], project_root)
    
    # Test AlgorithmHelper.fibonacci method
    fibonacci_symbol = symbols.get('AlgorithmHelper.fibonacci')
    assert fibonacci_symbol is not None, 'AlgorithmHelper.fibonacci not found'
    assert 'links' in fibonacci_symbol, 'Links field missing'
    
    links = fibonacci_symbol['links']
    assert len(links) == 1, f'Expected 1 link, got {len(links)}'
    
    link = links[0]
    assert link['symbol'] == 'maxSubArrayLen', f"Link symbol incorrect: {link['symbol']}"
    assert link['display'] == '[maxSubArrayLen]', f"Link display incorrect: {link['display']}"
    assert link['target'] == 'maxSubArrayLen', f"Link target incorrect: {link['target']}"
    assert link['valid'] == True, "Link should be valid"


def test_class_docstring_stripping():
    """Test that class code extraction removes all docstrings and inserts 'pass' if needed."""
    import tempfile
    import textwrap
    import ast
    project_root = Path(__file__).parent.parent.parent.resolve()
    # Minimal test class with class and method docstrings
    code = textwrap.dedent('''
        class TestClass:
            """Class docstring"""
            def method_with_doc(self):
                """Method docstring"""
                x = 1
            def method_without_doc(self):
                y = 2
            def only_doc(self):
                """Only docstring"""
    ''')
    # Write to a temp file
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as f:
        f.write(code)
        f.flush()
        test_file = Path(f.name)
    try:
        extractor = PythonExtractor()
        symbols = extractor.extract_from_file(test_file, project_root)
        cls = symbols.get('TestClass')
        assert cls is not None, 'TestClass not found'
        class_code = cls['code']
        # Should not contain any docstring
        assert '"""' not in class_code, 'Docstring not removed from class code'
        assert 'Class docstring' not in class_code, 'Class docstring not removed'
        assert 'Method docstring' not in class_code, 'Method docstring not removed'
        # Should contain all method signatures
        assert 'def method_with_doc' in class_code, 'method_with_doc missing'
        assert 'def method_without_doc' in class_code, 'method_without_doc missing'
        assert 'def only_doc' in class_code, 'only_doc missing'
        # Should insert pass for only_doc
        lines = class_code.splitlines()
        found_only_doc = False
        for i, line in enumerate(lines):
            if 'def only_doc' in line:
                found_only_doc = True
                # Next non-empty line should be 'pass'
                for j in range(i+1, len(lines)):
                    if lines[j].strip():
                        assert lines[j].strip() == 'pass', 'pass not inserted for empty method'
                        break
        assert found_only_doc, 'only_doc method not found'
        # Should be valid Python code
        try:
            ast.parse(class_code)
        except Exception as e:
            assert False, f'Class code is not valid Python: {e}'
    finally:
        test_file.unlink()


if __name__ == '__main__':
    print("Running extractor tests...")
    test_extractor()
    print("✓ Basic extractor tests passed")
    
    print("Running link extraction tests...")
    test_link_extraction()
    print("✓ Link extraction tests passed")
    
    print("Running link validation tests...")
    test_link_validation()
    print("✓ Link validation tests passed")
    
    print("Running class method link tests...")
    test_class_method_links()
    print("✓ Class method link tests passed")
    
    print("All tests passed!") 