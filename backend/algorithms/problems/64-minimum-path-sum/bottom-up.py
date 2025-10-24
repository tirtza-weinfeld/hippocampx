def minPathSum(grid: list[list[int]]) -> int:
    """
    Intuition:
        Deep Dive: 2D to 1D:
            In the 2D DP table, each cell depends only on its top and left neighbors:
            `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`
            That means to compute row i, you only need:
            	the current row's left value (`dp[i][j-1]`), and
            	the previous row's value at the same column (`dp[i-1][j]`).
            So you can compress the table into one list of length c (number of columns):
            	`dp[j]` keeps the current min path sum at column j (effectively `dp[i][j]`),
            	`dp[j-1]` is the left cell,
            	and as you move row by row, `dp[j]` from the previous iteration serves as the top cell.
        Variables:
            dp : dp has one extra slot (index 0) as a sentinel = ∞ to avoid boundary checks . `dp[j]` = min path sum to reach current cell in column `j-1`
        Expressions:
            'min(dp[j], dp[j - 1]) + grid[i][j - 1]'=  update current cell: min(top, left) + cell value      
    Time Complexity:
        O(r * c)                
    """
    r, c = len(grid), len(grid[0])
    dp = [float("inf")] * (c + 1); dp[1] = 0
    for i in range(r):
        for j in range(1, c + 1):
            dp[j] = min(dp[j], dp[j - 1]) + grid[i][j - 1]
    return dp[c]

