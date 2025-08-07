class Backtrack:
    def solveNQueens(self, n: int) -> list[list[str]]:
        """
        Variables:
            - cols:  Columns where queens are placed
            - diag1: The main diagonal where queens are placed (↘) r - c
            - diag2: The anti-diagonal where queens are placed (↙) r + c

        Expressions:
            - 'board[row][col] = "."': Remove the queen (backtrack)
            - 'board[row][col] = "Q"': Place the queen
            - 'continue': Skip invalid positions
            - 'dfs(row + 1)': Recurse to the next row
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

    def exist(self, board: list[list[str]], word: str) -> bool:

        rows, cols, n = len(board), len(board[0]), len(word)

        def dfs(r: int, c: int, i: int) -> bool:
            if i == n:
                return True
            if not (0 <= r < rows and 0 <= c < cols and board[r][c] == word[i]):
                return False
            tmp, board[r][c] = board[r][c], "#"
            for x, y in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if dfs(x, y, i + 1):
                    board[r][c] = tmp
                    return True
            board[r][c] = tmp
            return False

        return any(
            dfs(r, c, 0)
            for r in range(rows)
            for c in range(cols)
            if board[r][c] == word[0]
        )

    def permute(self, nums: list[int]) -> list[list[int]]:

        result, n = [], len(nums)

        def dfs(i):

            if i == n:
                result.append(nums[:])
            else:
                for j in range(i, n):
                    nums[i], nums[j] = nums[j], nums[i]
                    dfs(i + 1)
                    nums[j], nums[i] = nums[i], nums[j]

        dfs(0)
        return result

    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        res, path = [], []

        def dfs(i: int, rem: int) -> None:
            if rem == 0:
                res.append(path.copy())
                return
            for j in range(i, len(candidates)):
                if (c := candidates[j]) > rem:
                    break
                path.append(c)
                dfs(j, rem - c)
                path.pop()

        dfs(0, target)
        return res
