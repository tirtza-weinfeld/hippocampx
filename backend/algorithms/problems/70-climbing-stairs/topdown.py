def climbStairs(n: int) -> int:
    memo = {}
    def dp(i):
        if i <= 0:
            return i == 0
        if i not in memo:
            memo[i] = dp(i - 1) + dp(i - 2)
        return memo[i]
    return dp(n)
