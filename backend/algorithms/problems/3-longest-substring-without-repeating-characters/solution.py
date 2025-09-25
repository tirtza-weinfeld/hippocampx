def longest_substring_without_repeating_characters(s: str) -> int:
    """
    Time Complexity:
        O(n)
        where n is the length of the string. Each character is visited once by the right pointer, and the left pointer only moves forward, so the sliding window expands and contracts at most n times total.
    
    Args:
        s: Input string to analyze
    
    Expressions:
        'l = max(mp[c] + 1, l)' : ensures that l does not move backward in cases where the last occurrence of s[r] was before l.
    
    Returns:
        Length of the longest substring without repeating characters
    """
    mp, l, max_length = {}, 0, 0
    for r, c in enumerate(s):
        if c in mp:
            l = max(mp[c] + 1, l)
        mp[c] = r
        max_length = max(max_length, r - l + 1)
    return max_length
