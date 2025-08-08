class SudokuSolver:
    def solveSudoku(self, board: list[list[str]]) -> None:
        """
        Topics:
        - Backtracking
        - DFS
        - Sudoku
        - Games
        """

        D = set("123456789")
        rows = [set() for _ in range(9)]; cols = [set() for _ in range(9)]; boxes = [set() for _ in range(9)]
        empties: list[tuple[int,int]] = []
        for i in range(9):
            for j in range(9):
                v = board[i][j]
                if v == '.': empties.append((i, j))
                else: 
                    rows[i].add(v); cols[j].add(v); boxes[i//3*3 + j//3].add(v)

        def dfs() -> bool:
            if not empties: return True
            k, (i, j), cand = min(
                ((t, (i, j), D - (rows[i] | cols[j] | boxes[i//3*3 + j//3])) for t, (i, j) in enumerate(empties)),
                key=lambda x: len(x[2])
            )
            
            empties.pop(k)
            for d in cand:
                board[i][j] = d; rows[i].add(d); cols[j].add(d); boxes[(b:=i//3*3 + j//3)].add(d)
                if dfs(): return True
                rows[i].remove(d); cols[j].remove(d); boxes[b].remove(d)
            board[i][j] = '.'; empties.insert(k, (i, j))
            return False

        dfs()
