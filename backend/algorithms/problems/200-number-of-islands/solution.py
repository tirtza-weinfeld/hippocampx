from collections import deque

def number_of_islands(grid: list[list[str]]) -> int:
    """
    Intuition:
        Find, Count, and Sink 🏝️
        The strategy is to scan every cell of the grid. If an unvisited piece of land (`1`) is found, you've discovered a new island, so you increment the `islands` counter. Then, immediately launch a BFS from that cell to find and "sink" all connected parts of that same island by changing their value to `0`. This modification of the grid ensures each island group is counted exactly once.

    Time Complexity:
        O(m * n)
        where m and n are the dimensions of the grid. This is optimal as each cell is visited a constant number of times.

    Args:
        grid: 2D grid with '1' representing land and '0' representing water

    Returns:
        Number of islands in the grid
    """
    if not grid or not grid[0]:
        return 0
    m, n = len(grid), len(grid[0])
    dirs = ((1,0),(-1,0),(0,1),(0,-1))
    islands = 0

    for i in range(m):
        for j in range(n):
            if grid[i][j] == "1":
                islands += 1
                grid[i][j] = "0" # mark as visited
                q = deque([(i, j)])
                while q:
                    r, c = q.popleft()
                    for dr, dc in dirs:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == "1":
                            grid[nr][nc] = "0" # mark as visited
                            q.append((nr, nc)) 
    return islands
