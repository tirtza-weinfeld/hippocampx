def test_function():
    """Test function with expression tooltip.
    
    Variables:
        - x: test variable
        - y: another variable
        
    Expressions:
        - '(lo + hi) // 2': round down to the nearest integer
        - 'x + y': add two variables together
    """
    x = 1
    y = 2
    lo = 0
    hi = 10
    
    # This should trigger the expression tooltip
    mid = (lo + hi) // 2
    
    # This should also trigger the expression tooltip
    result = x + y
    
    return mid, result 