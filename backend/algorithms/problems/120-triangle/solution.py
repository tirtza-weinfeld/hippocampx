def triangle_minimum_path_sum(triangle: list[list[int]]) -> int:
    """
    Intuition:
        Paradigm: This is a classic bottom-up dynamic programming problem.
        Insight: The minimum path to the bottom *from* any cell `(r, c)` is independent of the path taken *to* that cell. This allows us to start at the bottom (where path sums are known) and iteratively compute the optimal path for each cell on the row above by choosing the cheaper of its two children's already-computed optimal paths.   
    
    Time Complexity:
        O(N)
        where N is the total number of cells in the triangle. The complexity is the number of subproblems (N), as each is solved once.
    """

    n, memo = len(triangle), {}

    def dp(r, c):
        if r == n - 1:
            return triangle[r][c]
        if (r, c) not in memo:
            memo[(r, c)] = triangle[r][c] + min(dp(r + 1, c), dp(r + 1, c + 1))
        return memo[(r, c)]

    return dp(0, 0)
