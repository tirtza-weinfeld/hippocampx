class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        r"""
        Rule of thumb:
            Heap-based Prim → use for sparse graphs
            Array-based Prim → use for dense or implicit complete graphs

        Time Complexity:
            $\Theta(V^2) = \Theta(n^2)$:
            This is array-based Prim’s algorithm.
            Each of the $n$ iterations performs:
                a linear scan to select the minimum dist node  → $\Theta(n)$
                a full relaxation over all $n$ vertices         → $\Theta(n)$
            Total time is therefore $\Theta(n^2)$.
            This is optimal for dense or implicit complete graphs,
            and avoids the extra $\log V$ factor of heap-based Prim.    
        """
        mst = set()                                   # nodes already in the MST
        dist = [10**18] * (n := len(points))          # dist[v] = cheapest edge from MST to v
        dist[0] = total = 0                           # start MST from node 0 (cost 0)

        for _ in range(n):
            u = min((i for i in range(n) if i not in mst), key=dist.__getitem__) # pick the non-MST node with the smallest connection cost
            mst.add(u) # permanently add u to the MST
            total += dist[u] # pay the edge cost that connects u
            x, y = points[u]

            for v ,(x2,y2) in enumerate(points):
                if v not in mst and (d := abs(x - x2) + abs(y - y2)) < dist[v]:
                    dist[v] = d

        return total
