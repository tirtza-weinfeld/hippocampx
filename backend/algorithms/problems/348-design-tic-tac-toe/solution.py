class TicTacToe:

    def __init__(self, n: int):

        self.n = n
        self.rows, self.cols = [0] * n, [0] * n
        self.diag = self.anti_diag = 0



    def move(self, r: int, c: int, player: int) -> int:

        p = 1 if player == 1 else -1

        self.cols[c] += p
        self.rows[r] += p
        self.diag += (c == r) * p
        self.anti_diag += (c == self.n - 1 - r) * p


        return player if self.n*p in [ self.rows[r] , self.cols[c] , self.diag , self.anti_diag ] else 0
            


