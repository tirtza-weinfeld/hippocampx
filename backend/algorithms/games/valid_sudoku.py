class Sudoku:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        """
        Expressions:
         -'if (' :  Check for duplicates
         -'if (num := board[r][c]) != "."': Skip empty cells
         - 'cube_index := (r // 3) * 3 + (c // 3)':  The formula works by treating the 9×9 board as a 3×3 grid of 3×3 boxes:\
                - `r//3` gives which box-row (0,1,2) you’re in; `c//3` gives which box-column (0,1,2).\
                - Multiplying the box-row by 3 and adding the box-column yields a unique index 0–8 for each 3×3 cube.

        
        """

        row = [set() for _ in range(9)]
        col = [set() for _ in range(9)]
        cube = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                if (num := board[r][c]) != ".": 

                    if (
                        num in col[c]
                        or num in row[r]
                        or num in cube[(cube_index := (r // 3) * 3 + (c // 3))]
                    ):
                        return False
                    

                    col[c].add(num)
                    row[r].add(num)
                    cube[cube_index].add(num)
        return True
