import heapq


class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        r"""
        Time Complexity:
            $\Theta(E \log V) = \Theta(n^2 \log n)$:
            This is heap-based Prim’s algorithm.
            The graph is complete (implicit), so $E = \Theta(n^2)$ and $V = n$.
            Each heap operation costs $\log V$, giving $\Theta(E \log V)$ overall.
            Using dist[v] or a true decrease-key heap only improves constants, not the asymptotic bound.
        """
        mst = set() # nodes already fixed in the MST
        pq = [(0, 0)]  # (edge_weight, node)
        total = 0

        while pq:
            w, u = heapq.heappop(pq) # cheapest available edge
            if u in mst: # stale entry → ignore
                continue
            mst.add(u) # fix u in the MST
            total += w  # pay the edge cost

            x, y = points[u]
            for v, (x2, y2) in enumerate(points):
                if v not in mst:
                    weight = abs(x - x2) + abs(y - y2)
                    heapq.heappush(pq, (weight, v)) # Without a true decrease-key heap, extra pushes are unavoidable in heap-Prim. Using dist[v] (or a decrease-key heap) reduces constants, not asymptotic complexity, so we keep the code simpler.

        return total
