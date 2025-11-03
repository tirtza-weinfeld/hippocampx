"""
Tic Tac Toe Player
"""

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.

    Intuition:
        Count moves: X goes first, so if X and O have equal counts, it's X's turn.
        Otherwise, it's O's turn.

    Time Complexity:
        O(n²) - iterate through all cells
    """
    x_count = sum(row.count(X) for row in board)
    o_count = sum(row.count(O) for row in board)
    return X if x_count == o_count else O


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.

    Intuition:
        Find all empty cells. Each empty cell is a valid action.

    Time Complexity:
        O(n²) - iterate through all cells
    """
    possible_actions = set()
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                possible_actions.add((i, j))
    return possible_actions


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.

    Intuition:
        Create deep copy of board, apply the action for current player.
        Validates action is legal.

    Time Complexity:
        O(n²) - deep copy the board
    """
    i, j = action
    if board[i][j] != EMPTY:
        raise ValueError("Invalid action: cell already occupied")

    current_player = player(board)
    new_board = [row[:] for row in board]
    new_board[i][j] = current_player
    return new_board


def winner(board):
    """
    Returns the winner of the game, if there is one.

    Intuition:
        Check all possible winning lines: 3 rows, 3 columns, 2 diagonals.
        Return the player if they have 3 in a row.

    Time Complexity:
        O(1) - constant 8 lines to check
    """
    # Check rows
    for row in board:
        if row[0] == row[1] == row[2] and row[0] is not None:
            return row[0]

    # Check columns
    for j in range(3):
        if board[0][j] == board[1][j] == board[2][j] and board[0][j] is not None:
            return board[0][j]

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] and board[0][0] is not None:
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] and board[0][2] is not None:
        return board[0][2]

    return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.

    Intuition:
        Game is over if there's a winner or no empty cells remain.

    Time Complexity:
        O(1) for winner check, O(n²) for board full check
    """
    if winner(board) is not None:
        return True
    return all(cell is not None for row in board for cell in row)


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.

    Intuition:
        Terminal utility value for minimax. X maximizes, O minimizes.

    Time Complexity:
        O(1) - winner check is constant time
    """
    game_winner = winner(board)
    if game_winner == X:
        return 1
    elif game_winner == O:
        return -1
    else:
        return 0


def minimax(board):
    """
    Returns the optimal action for the current player on the board.

    Intuition:
        Minimax with Alpha-Beta Pruning:
        *Paradigm*: Zero-sum game. Each player maximizes their own score.
        *Insight*: `dp(state, curr_player, alpha, beta)` returns best score with pruning.
        Alpha-beta prunes when alpha ≥ beta. Memoization caches repeated states.

    Time Complexity:
        O(b^(d/2)) average case with pruning
        where b is branching factor (~5 avg), d is depth (~9 max)
    """
    if terminal(board):
        return None

    memo = {}

    def dp(state, curr_player, alpha, beta):
        state_key = (str(state), curr_player)
        if state_key in memo:
            return memo[state_key]

        if terminal(state):
            w = winner(state)
            value = 1 if w == curr_player else (0 if w is None else -1)
            memo[state_key] = value
            return value

        # Try all moves with alpha-beta pruning
        opponent = O if curr_player == X else X
        value = float('-inf')
        for action in actions(state):
            value = max(value, -dp(result(state, action), opponent, -beta, -alpha))
            alpha = max(alpha, value)
            if alpha >= beta:
                break  # Prune

        memo[state_key] = value
        return value

    # Pick best action
    curr = player(board)
    opponent = O if curr == X else X
    return max(
        actions(board),
        key=lambda action: -dp(result(board, action), opponent, float('-inf'), float('inf'))
    )
