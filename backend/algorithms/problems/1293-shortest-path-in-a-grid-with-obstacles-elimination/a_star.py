import heapq

def manhattan_distance(a: tuple[int, int], b: tuple[int, int]) -> int:
    """Calculate Manhattan distance between two points."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])



def shortest_path_in_a_grid_with_obstacles_elimination(grid: list[list[int]], k: int) -> int:
    """
    Time Complexity:
        O(m * n * k * log(m * n * k))
    Variables:
        pq: (f_cost, steps, r, c, remaining_k) 
    Expressions:
        'new_remaining_k': = remaining_k - grid[nr][nc], how many obstacle eliminations you will have left **after** moving to the next cell , if the cell is empty grid[nr][nc] is 0, if the cell is an obstacle grid[nr][nc] is 1.
        'if remaining_k < max_k[r][c]': Handle items that are already outdated by the time they are popped.
    Topics:
        a-star
    """

    rows, cols = len(grid), len(grid[0])

    def h(r: int, c: int) -> int:
        return manhattan_distance((r, c), (rows - 1, cols - 1))
    
    if k >= (md:= h(0, 0)) - 1:
        return md

    pq = [(md, 0, 0, 0, k)]
    
    max_k = [[-1] * cols for _ in range(rows)]
    max_k[0][0] = k



    while pq:
        _, steps, r, c, remaining_k = heapq.heappop(pq)
        
        if (r, c) == (rows - 1, cols - 1):
            return steps
        
        if remaining_k < max_k[r][c]:
            continue

        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            if 0 <= (nr:= r + dr) < rows and 0 <= (nc:= c + dc) < cols:
                if (new_remaining_k := remaining_k - grid[nr][nc] ) > max_k[nr][nc]:
                    max_k[nr][nc] = new_remaining_k
                    heapq.heappush(pq, ((steps + 1) + h(nr, nc), steps + 1, nr, nc, new_remaining_k))
                    
    return -1
