def generateParenthesis(n: int) -> list[str]:
    r"""
    Intuition:
    build the string one char at a time while never letting it be invalid.
    Rules: add *(* `while o < n`; add *)* only `if c < o` (more opens than closes so far).
    DFS explores all valid prefixes and prunes invalid ones; `when o == c == n`, it is complete.

    """
    res = []
    def dfs(s: str, o: int, c: int):
        if o == c == n:
            res.append(s); return
        if o < n: dfs(s + "(", o + 1, c)
        if c < o: dfs(s + ")", o, c + 1)
    dfs("", 0, 0)
    return res
