import heapq


class SolutionAStar:
    def shortestPath(self, grid: list[list[int]], k: int) -> int:
        rows, cols = len(grid), len(grid[0])
        # Early exit
        min_dist = rows + cols - 2
        if k >= min_dist:
            return min_dist

        # max_k[r][c] = best remaining eliminations seen at (r,c)
        max_k = [[-1] * cols for _ in range(rows)]
        max_k[0][0] = k

        # Priority queue: (f_score, steps, r, c, remaining_k)
        # f_score = steps + heuristic
        def heuristic(r, c):
            return (rows - 1 - r) + (cols - 1 - c)

        pq = [(heuristic(0,0), 0, 0, 0, k)]
        directions = [(1,0),(-1,0),(0,1),(0,-1)]

        while pq:
            f, steps, r, c, rem_k = heapq.heappop(pq)
            if (r, c) == (rows - 1, cols - 1):
                return steps

            # Skip if we've found a better state already
            if rem_k < max_k[r][c]:
                continue

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nk = rem_k - grid[nr][nc]
                    if nk >= 0 and nk > max_k[nr][nc]:
                        max_k[nr][nc] = nk
                        g = steps + 1
                        f_new = g + heuristic(nr, nc)
                        heapq.heappush(pq, (f_new, g, nr, nc, nk))

        return -1
