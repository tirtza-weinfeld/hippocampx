from collections import deque

class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        """
        Intuition:
            Find, Count, and Sink 🏝️
            The strategy is to scan every cell of the grid. If an unvisited piece of land (`1`) is found, you've discovered a new island, so you increment the `islands` counter. Then, immediately launch a BFS from that cell to find and "sink" all connected parts of that same island by changing their value to `0`. This modification of the grid ensures each island group is counted exactly once.
    
        Time Complexity:
            O(R * C)
            where R and C are the dimensions of the grid. This is optimal as each cell is visited a constant number of times.
    
        Args:
            grid: 2D grid with '1' representing land and '0' representing water
    
        Returns:
            Number of islands in the grid
        """
        R, C = len(grid), len(grid[0])
        islands, directions = 0, [(1, 0), (-1, 0), (0, 1), (0, -1)]

        for r in range(R):
            for c in range(C):
                if grid[r][c] == "1":
                    islands += 1
                    grid[r][c] = "0"

                    q = deque([(r, c)])
                    while q:
                        y, x = q.popleft()
                        for dy, dx in directions:
                            if 0 <= (i := y + dy) < R and 0 <= (j := x + dx) < C and grid[i][j] == "1":
                                grid[i][j] = "0"
                                q.append((i, j))

        return islands