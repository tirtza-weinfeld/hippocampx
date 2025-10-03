def longest_substring_without_repeating_characters(s: str) -> int:
    """
    Time Complexity:
        O(n)
        
    Args:
        s: Input string to analyze
    
    Expressions:
        'l = max(c_idx[c] + 1, l)' : ensures that l does not move backward in cases where the last occurrence of s[r] was before l.
    
    Returns:
        Length of the longest substring without repeating characters
    """
    c_idx, l, max_length = {}, 0, 0
    for r, c in enumerate(s):
        if c in c_idx:
            l = max(c_idx[c] + 1, l)
        c_idx[c] = r
        max_length = max(max_length, r - l + 1)
    return max_length
