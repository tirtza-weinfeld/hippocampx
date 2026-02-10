def longestIncreasingPath( matrix: list[list[int]]) -> int:
    """
    Intuition:
        DFS + Memoization as a Directed Acyclic Graph:
        Treat each cell as a node with directed edges to strictly larger neighboring cells.
        The longest increasing path starting at (i, j) equals\
        $1 + \max(\\text{paths from valid increasing neighbors})$ .
        Since values strictly increase along edges, the graph has no cycles,\
        so DFS with memoization computes each state exactly once.
    Time Complexity:
        $O(mn)$
        Each cell $(i, j)$ is computed once and memoized.
        For each cell, we examine at most $4$ neighbors.
    Variables:
        directions: 4 possible moves (right, left, down, up)
        m: number of rows in the matrix
        n: number of columns in the matrix
        memo: cache mapping $(i, j)$ → longest increasing path starting at that cell
        max_len: global maximum path length across all cells
    """
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    m, n, memo = len(matrix), len(matrix[0]), {}

    def dp(i, j):
        """
        dp(i, j): returns longest increasing path starting from cell $(i, j)$
        """
        if (i, j) not in memo:
            memo[i, j] = 1 + max(
                (
                    dp(r, c)
                    for di, dj in directions
                    if 0 <= (r := i + di) < m and 0 <= (c := j + dj) < n and matrix[r][c] > matrix[i][j]
                ),
                default=0,
            )
        return memo[i, j]

    max_len = 0
    for r in range(m):
        for c in range(n):
            max_len = max(dp(r, c), max_len)
    return max_len
