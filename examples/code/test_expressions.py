def test_function_with_expressions():
    """Test function with various expression formats.
    
    Variables:
        - x: test variable
        - y: another test variable
        
    Expressions:
        - 'x + y': add two variables together
        - 'x * 2': multiply x by 2
        - 'len(items)': get the length of items list
        - 'items[i] if i < len(items) else None': safe array access
    """
    x = 1
    y = 2
    items = [1, 2, 3]
    i = 0
    
    result = x + y
    doubled = x * 2
    count = len(items)
    safe_item = items[i] if i < len(items) else None
    
    return result, doubled, count, safe_item


def test_function_without_expressions():
    """Test function without expressions section.
    
    Variables:
        - z: simple variable
    """
    z = 10
    return z


def test_function_with_empty_expressions():
    """Test function with empty expressions section.
    
    Variables:
        - w: another variable
        
    Expressions:
    """
    w = 5
    return w 