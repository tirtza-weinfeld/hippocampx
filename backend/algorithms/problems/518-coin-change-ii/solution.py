def coin_change_II(amount: int, coins: list[int]) -> int:
    """
    Intuition:
        Paradigm: This is a classic **Unbounded Knapsack** counting problem.
        
        Insight: To count *combinations* without overcounting *permutations* (`1+2` vs `2+1`), the DP imposes a strict processing order on the coins. This ensures that combinations are always built in the same sequence (e.g., using smaller denomination coins before larger ones), elegantly eliminating duplicates.

    Time Complexity:
        O(n * amount)
        where n is the number of coins and amount is the target amount.
    """
    memo, n = {}, len(coins)

    def dp(c, amount):
        if amount == 0:
            return 1
        if amount < 0 or c == n:
            return 0
        if (c, amount) not in memo:
            memo[c, amount] = dp(c, amount - coins[c]) + dp(c + 1, amount)
        return memo[c, amount]

    return dp(0, amount)
