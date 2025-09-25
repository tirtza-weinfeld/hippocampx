def n_queens(n: int) -> list[list[str]]:
    """
    Intuition:
        Backtrack with State Tracking ♛
        Place one queen per row. Track blocked columns, diagonals: Valid placement → recurse to next row, Invalid → skip, After recursion, remove queen to try next column. Track state using: `cols` for columns, `diag1` for main diagonal *↘* `row - col`, `diag2` for anti-diagonal *↙* `row + col`.

    Time Complexity:
        O(N!)
        first row: N choices, second row: N-1 choices, total permutations = N!, pruning drastically reduces actual recursion tree.

    Args:
        n: Size of the chessboard (n x n)

    Variables:
        cols: Columns where queens are placed
        diag1: The main diagonal where queens are placed (↘) `r - c`
        diag2: The anti-diagonal where queens are placed (↙) `r + c`

    Expressions:
        `board[row][col] = "."`: Remove the queen (backtrack)
        `board[row][col] = "Q"`: Place the queen
        `continue`: Skip invalid positions
        `dfs(row + 1)`: Recurse to the next row

    Returns:
        List of all valid queen placements
    """

    result, board = [], [["."] * n for _ in range(n)]

    cols, diag1, diag2 = set(), set(), set()

    def dfs(row: int):
        if row == n:
            result.append(["".join(r) for r in board])
            return

        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue

            board[row][col] = "Q"

            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)

            dfs(row + 1)

            board[row][col] = "."
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    dfs(0)
    return result