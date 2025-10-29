class Solution:

    def minimumTotal(self, triangle: list[list[int]]) -> int:

        memo = {}

        def dp(r, i):
            if r == len(triangle):
                return 0
            if (r, i) not in memo:
                memo[r, i] = triangle[r][i] + min(dp(r + 1, i), dp(r + 1, i + 1))
            return memo[r, i]

        return dp(0, 0)

