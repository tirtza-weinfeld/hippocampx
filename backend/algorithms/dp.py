

class DP:
    def minimumTotal(self, triangle: list[list[int]]) -> int:
        memo, n = {}, len(triangle)
        def dp(r, c):
            if r >= n or c > r:
                return 0
            if (r, c) not in memo:
                memo[(r, c)] = min(
                    triangle[r][c] + dp(r + 1, c), 
                    triangle[r][c] + dp(r + 1, c + 1)
                )
            return memo[(r, c)]
        return dp(0, 0)
    