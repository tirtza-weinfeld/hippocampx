from collections import deque

def zero_one_matrix(mat: list[list[int]]) -> list[list[int]]:
    """
    Intuition:
        Multi-Source BFS from the Target 🎯:
        Instead of starting a separate BFS from every `1` to find the nearest `0` (which would be slow), this approach inverts the problem. It starts a single, **multi-source BFS from all `0`s simultaneously**. The level of the BFS at which a cell is reached is, by definition, its shortest distance to any `0`. This "start from the answer" strategy is a powerful technique for shortest path problems.

    Time Complexity:
        O(m * n):
        where m and n are the dimensions of the grid. 
        Every cell is enqueued and processed exactly once, making this the optimal solution.
    """
    m, n = len(mat), len(mat[0])
    dist = [[-1] * n for _ in range(m)]
    q = deque()
    # Initialize queue with all zero-cells
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 0:
                dist[i][j] = 0
                q.append((i, j))
    
    while q:
        i, j = q.popleft()
        for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
            ni, nj = i + di, j + dj
            if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] < 0:
                dist[ni][nj] = dist[i][j] + 1
                q.append((ni, nj))
    return dist
