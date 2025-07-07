import heapq


class Solution:
    def minimumEffortPath(self, heights: list[list[int]]) -> int:
        """
        [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)
        Args:
            heights: 2D list of integers representing the heights of the cells
        Returns:
            int: minimum effort to reach the bottom-right cell
        Variables:
        - pq:  Priority queue stores (max_effort_on_path, r, c)
        - resolved: set to store the positions that have been resolved
        """

        R, C = len(heights), len(heights[0])
        pq, resolved = [(0, 0, 0)], set()

        while pq:
            effort, r, c = heapq.heappop(pq)
            if (r, c) in resolved: continue
            if (r, c) == (R - 1, C - 1): return effort
            resolved.add((r, c))

            for nr, nc in [(r, c + 1), (r, c - 1), (r + 1, c), (r - 1, c)]:
                if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in resolved:
                    neighbor_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                    heapq.heappush(pq, (neighbor_effort, nr, nc))
