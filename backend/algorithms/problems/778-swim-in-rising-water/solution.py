import heapq

def swim_in_rising_water(grid: list[list[int]]) -> int:
    """
    Args:
        grid: 2D list of integers representing the elevations of the cells
    
    Returns:
        minimum time to travel from `(0, 0)` to `(N-1, N-1)`
        
    Variables:
        pq:  Priority queue stores (max_elevation_on_path, r, c)
        resolved: set to store the cells for which we have found the minimum time required to reach them
    """

    n=len(grid)
    pq, resolved = [(grid[0][0], 0, 0)], set()

    while pq:
        time, r, c = heapq.heappop(pq)
        if (r, c) in resolved:continue
        if (r, c) == (n - 1, n - 1):return time
        resolved.add((r, c))

        for nr, nc in [(r, c + 1), (r, c - 1), (r + 1, c), (r - 1, c)]:
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in resolved:
                bottleneck_time = max(time, grid[nr][nc])
                heapq.heappush(pq, (bottleneck_time, nr, nc))
