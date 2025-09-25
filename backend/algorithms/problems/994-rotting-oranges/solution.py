from collections import deque

def rotting_oranges(grid: list[list[int]]) -> int:
    """
    Intuition:
        Multi-Source BFS 🍊:
        The key is to initialize the queue with the coordinates of *all* initially rotten oranges. The BFS then naturally simulates the rotting process in parallel from all sources. Each "level" of the BFS corresponds to one minute passing. Finally, you must check if any `fresh_oranges` remain to handle cases where some are unreachable.

    Time Complexity:
        O(m * n):
        where m and n are the dimensions of the grid. Each cell is enqueued and dequeued at most once, making the process highly efficient and optimal.

    """
    m, n = len(grid), len(grid[0])
    q, fresh = deque(), 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 2:
                q.append((i, j))
            elif grid[i][j] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    
    minutes = 0
    while q and fresh:
        minutes += 1
        for _ in range(len(q)):
            x, y = q.popleft()
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh -= 1
                    q.append((nx, ny))
    
    return minutes if fresh == 0 else -1
