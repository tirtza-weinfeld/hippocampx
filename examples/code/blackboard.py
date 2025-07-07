import heapq


class Solution:
    def swimInWater(self, grid: list[list[int]]) -> int:
        """
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
