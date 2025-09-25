def shortest_path_in_a_grid_with_obstacles_elimination(grid: list[list[int]], k: int) -> int:
    """
    Warning:
     This is less efficient than A* for this problem.
    Variables:
        pq: (g_cost, r, c, k_rem), The priority uses g_cost (steps) itself. No heuristic is used.
        steps: The number of steps taken so far (g_cost)
        max_k: max_k[r][c] stores the max eliminations we have at cell (r,c)
    Expressions:
        'heapq.heappush(pq, (steps + 1, nr, nc, new_k))': The priority is simply the new step count.No heuristic is added, which is the only difference from the A* implementation.
        'heapq.heappop(pq)': Pop the path with the lowest g_cost (steps) so far
        'k_rem < max_k[r][c]': Prune paths that are suboptimal for a given cell

    """

    rows, cols = len(grid), len(grid[0])
    if k >= rows + cols - 3:
        return rows + cols - 2
  
    pq = [(0, 0, 0, k)]
    
    max_k = [[-1] * cols for _ in range(rows)]
    max_k[0][0] = k

    while pq:
        
        steps, r, c, k_rem = heapq.heappop(pq)
        
        if (r, c) == (rows - 1, cols - 1):
            return steps
        
        if k_rem < max_k[r][c]:
            continue

        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            if 0 <= (nr:= r + dr) < rows and 0 <= (nc:= c + dc) < cols:
                if (new_k:= k_rem - grid[nr][nc]) > max_k[nr][nc]:
                    max_k[nr][nc] = new_k
                    heapq.heappush(pq, (steps + 1, nr, nc, new_k))
                    
    return -1