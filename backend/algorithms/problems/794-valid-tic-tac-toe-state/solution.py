def valid_tic_tac_toe_state(board: list[str]) -> bool:

    rows, cols = [0] * (n := 3), [0] * n
    diag = anti_diag = diff = 0

    for r, row in enumerate(board):
        for c, p in enumerate(row):

            diff += (d := 1 if p == "X" else -1 if p == "O" else 0)
            rows[r] += d
            cols[c] += d
            diag += (r == c) * d
            anti_diag += (r + c == n - 1) * d

    win = lambda p: any(line == n * p for line in (diag, anti_diag, *rows, *cols))

    x_win ,o_win = win(1), win(-1)

    return not (diff < 0 or diff > 1 or x_win and o_win or x_win and diff != 1 or o_win and diff != 0 )
