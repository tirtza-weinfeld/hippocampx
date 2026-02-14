class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        starts = [
            (r, c)
            for r, row in enumerate(board)
            for c, col in enumerate(row)
            if col == word[0]
        ]

        def scan(r, c, i):
            if i < len(word) and board[r][c] == word[i]:
                board[r][c] = "#"
                if scan(r - 1, c) or scan(r, c - 1) or scan(r + 1, c) or scan(r, c + 1):
                    return True
                board[r][c] = word[i]
            return False

        for r, c in starts:
            if scan(r, c, 0):
                return True
        return False
