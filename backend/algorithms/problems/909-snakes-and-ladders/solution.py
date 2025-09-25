from collections import deque

def snakes_and_ladders(board: list[list[int]]) -> int:
    """
    Intuition:
        Flatten the Board First 🎲
        The key insight here is to **pre-process the 2D `board` into a 1D `flat_board` list**. This powerful first step handles all the complex Boustrophedonical logic upfront. By doing this, the BFS loop becomes exceptionally clean and avoids the need for a coordinate conversion function. The search can then operate on a simple 1D array, treating the board as the simple, linear graph it truly represents.

    Time Complexity:
        O(n^2)
        where n is the dimension of the board. The initial flattening of the board takes O(n^2) time. The subsequent BFS visits each of the n^2 squares at most once.
    """

    flat_board =  [0] # Dummy 0 for 1-based indexing
    for r, row in enumerate(reversed(board)):
        flat_board.extend(row[::1 if r % 2 == 0 else -1])
        
    target =(n:= len(board)) * n 
    moves, queue =  {1: 0}, deque([1])

    while queue:
        current = queue.popleft()
        for roll in range(1, 7):
            nxt = current + roll
            if nxt > target:
                break
            landing = flat_board[nxt] if flat_board[nxt] != -1 else nxt
            if landing not in moves:
                moves[landing] = moves[current] + 1
                if landing == target:
                    return moves[landing]
                queue.append(landing)
    return -1
