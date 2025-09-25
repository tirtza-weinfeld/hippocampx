def stone_game_IV(n: int) -> bool:
    """
    Intuition:
        Minimax:
        *Paradigm*: This is a classic *impartial game* solved using the *Minimax* principle on game states.
        *Insight*: A position is defined as *winning* if you can make *any* move to a position that you know is *losing* for your opponent. The DP builds this win/loss classification for every number of stones up to `n`, starting from the base case that 0 stones is a losing position.

    Time Complexity:
        O(n * sqrt(n)) 
        try all squares for each `x`
    """

    memo = {0: False}

    def dp(n):
        if n not in memo:
            memo[n] = any(not dp(n - i**2) for i in range(int(n**0.5), 0, -1))
        return memo[n]

    return dp(n)
