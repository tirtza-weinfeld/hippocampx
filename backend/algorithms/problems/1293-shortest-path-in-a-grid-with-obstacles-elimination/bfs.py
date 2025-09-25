from collections import deque

def shortest_path_in_a_grid_with_obstacles_elimination(grid: list[list[int]], k: int) -> int:
    """
    Warning:
        In practice, A* Search O(m * n * k * log(m * n * k)) is faster than this O(m * n * k) .
    
    Intuition:
        bfs with State-Budget Pruning 🔍:
        The core idea is to perform a standard BFS over `(row, col, steps, remaining_k)` states, but only enqueue a move if it arrives at a cell with **strictly more** `remaining_k` than any prior visit. This pruning significantly reduces the number of states explored, making the algorithm much more efficient.
        **Trivial shortcut:** If `k ≥ rows+cols–2`, you can go straight in `rows+cols–2` steps without ever touching an obstacle.
        **Correctness guarantee:** Because BFS explores in order of increasing `steps`, the first time you dequeue the goal is the fewest-step path. Pruning by `remaining_k` never discards any shorter-step route—it simply avoids re-exploring dominated states.
      
    Time Complexity:
        O(m * n * k):
        Worst-case O(m * n * k) (every cell × every possible k), but aggressive pruning usually makes it far faster in practice.

    Space Complexity:
        O(m * n):
        for the `max_k` grid plus up to O(m * n * k) queued states in the pathological worst case.

    Variables:
        max_k:  max_k[r][c] = maximum eliminations remaining when visiting (r,c)
        q: (row, col, steps, remaining_k)
        min_steps:  Manhattan distance lower bound


    """
    
    rows, cols = len(grid), len(grid[0])
    min_steps = rows + cols - 3 
    if k >= min_steps:
        return min_steps
   
    max_k = [[-1] * cols for _ in range(rows)]
    max_k[0][0] = k

    
    q = deque([(0, 0, 0, k)])


    while q:
        r, c, steps, remaining_k = q.popleft()
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_remaining_k = remaining_k - grid[nr][nc]
                if new_remaining_k > max_k[nr][nc]:
                    if (nr, nc) == (rows - 1, cols - 1):
                        return steps + 1
                    max_k[nr][nc] = new_remaining_k
                    q.append((nr, nc, steps + 1, new_remaining_k))
    return -1

