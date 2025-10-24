def minPathSum(grid: list[list[int]]) -> int:
    """
    Time Complexity:
        O(r * c) 
    """
    r, c, memo = len(grid), len(grid[0]), {}
    def dp(i, j):
        if i == r - 1 and j == c - 1: return grid[i][j]
        if i >= r or j >= c: return float("inf")
        if (k := (i, j)) not in memo:
            memo[k] = grid[i][j] + min(dp(i + 1, j), dp(i, j + 1))
        return memo[k]
    return dp(0, 0)


