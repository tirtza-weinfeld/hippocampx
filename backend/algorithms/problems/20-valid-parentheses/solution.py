def isValid(s: str) -> bool:
    """
    Time Complexity:
        O(n)
    """
    m, stack = {")": "(", "}": "{", "]": "["}, []
    for b in s:
        if b in m:
            if not stack or m[b] != stack.pop():
                return False
        else:
            stack.append(b)
    return not stack
