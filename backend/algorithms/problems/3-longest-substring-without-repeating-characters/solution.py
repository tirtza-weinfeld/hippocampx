def longest_substring_without_repeating_characters(s: str) -> int:
    """
    Time Complexity:
        O(n)
        
    Args:
        s: Input string to analyze
    
    Expressions:
        'l = max(idx[c] + 1, l)' : ensures that l does not move backward in cases where the last occurrence of c was before l.
    
    Returns:
        Length of the longest substring without repeating characters
    """
    idx, l, max_length = {}, 0, 0
    for r, c in enumerate(s):
        if c in idx:
            l = max(idx[c] + 1, l)
        idx[c] = r
        max_length = max(max_length, r - l + 1)
    return max_length
