"""
Tic Tac Toe Player
"""

X, O, EMPTY = "X", "O", None


def initial_state():
    """
    Returns starting state of the board.
    """

    return [[EMPTY] * 3 for _ in range(3)]


def player(board):
    """
    Returns player who has the next turn on a board.
    """

    xs = sum(row.count(X) for row in board)
    os = sum(row.count(O) for row in board)
    return X if xs <= os else O


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """

    return {
        (i, j)
        for i, row in enumerate(board)
        for j, cell in enumerate(row)
        if cell is EMPTY
    }


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    i, j = action
    if board[i][j] is not EMPTY:
        raise ValueError("Invalid action")
    new = [row[:] for row in board]
    new[i][j] = player(board)
    return new


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """

    lines = (
        board[:]  # rows
        + [[board[r][c] for r in range(3)] for c in range(3)]  # cols
        + [
            [board[i][i] for i in range(3)],
            [board[i][2 - i] for i in range(3)],
        ]  # diags
    )
    for line in lines:
        if line[0] is not EMPTY and line.count(line[0]) == 3:
            return line[0]
    return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """

    return winner(board) is not None or all(cell is not EMPTY for row in board for cell in row)


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """

    win = winner(board)
    return 1 if win == X else -1 if win == O else 0


def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    
    if terminal(board):
        return None

    def max_value(b, α, β):
        if terminal(b):
            return utility(b), None
        v, mv = float("-inf"), None
        for a in actions(b):
            val, _ = min_value(result(b, a), α, β)
            if val > v:
                v, mv = val, a
                α = max(α, v)
            if α >= β:
                break
        return v, mv

    def min_value(b, α, β):
        if terminal(b):
            return utility(b), None
        v, mv = float("inf"), None
        for a in actions(b):
            val, _ = max_value(result(b, a), α, β)
            if val < v:
                v, mv = val, a
                β = min(β, v)
            if α >= β:
                break
        return v, mv

    _, move = (
        
        max_value(board, float("-inf"), float("inf"))
        if player(board) == X
        else min_value(board, float("-inf"), float("inf"))
    )
    return move
