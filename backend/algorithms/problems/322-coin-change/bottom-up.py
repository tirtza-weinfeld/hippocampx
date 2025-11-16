def coin_change(coins: list[int], amount: int) -> int:

    dp = [0] + [float("inf")] * amount
    for coin in reversed(coins):
        for r in range(coin, amount + 1):
            dp[r] = min(dp[r], 1 + dp[r - coin])

    return dp[amount] if dp[amount] != float("inf") else -1

