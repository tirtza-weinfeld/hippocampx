def stone_game_III(stoneValue: list[int]) -> str:
    """
    Intuition:
        Score-difference DP:
        Let `dp[i]` = max score difference current player can achieve starting at index `i`.
        Transition: `dp[i] = max_{k∈{1,2,3}} (sum(i..i+k-1) − dp[i+k])`. Answer from `dp[0]`.

    Time Complexity:    
        O(n)
        constant 3 choices per `i`
    """
    memo, n = {}, len(stoneValue)
    def dp(i):
        if i >= n:
            return 0
        if i not in memo:
            memo[i] = max(
                sum(stoneValue[i : i + k]) - dp(i + k) for k in range(1, 4)
            )
        return memo[i]
    return "Alice" if dp(0) > 0 else "Bob" if dp(0) < 0 else "Tie"