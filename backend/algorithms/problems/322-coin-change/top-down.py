def coin_change(coins: list[int], amount: int) -> int:

    memo, n = {}, len(coins)

    def dp(i, r):
        if r == 0: return 0
        if i ==n or r < 0: return float("inf")

        if (i, r) not in memo:
            memo[(i, r)] = min(
                1 + dp(i, r - coins[i]),
                dp(i + 1, r),
            )
        return memo[(i, r)]

    return m if (m := dp(0, amount)) < float("inf") else -1
