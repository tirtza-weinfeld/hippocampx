from heapq import heappush, heappop
from collections import defaultdict


class Solution:
    def maxProbability(self, n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
        """
        Intuition:
            We want the path from `start` to `end` with the largest product of edge probabilities:
            This is equivalent to Dijkstra’s algorithm, replacing *sum of distances* with \
            *product of probabilities* and switching from a *[2!]min-heap* to a *[2!]max-heap*.

            Deep Dive: Correctness:
                Each edge weight (probability) *$\in [0, 1]$*.
                Multiplying by a value *$\leq 1$* never increases the product, so the total probability \
                  along any path is monotonically non-increasing as the path length grows.
                This monotonicity guarantees that *once we extract a node with the current \
                  maximum probability from the heap, no later path can improve it.*
                    same invariant that makes Dijkstra correct for nonnegative edge weights.
                    By contrast, *longest path* problems fail this property because edge weights \
                can be positive and cumulative, allowing cycles to increase total weight \
                indefinitely (no monotonic bound), making them *NP-hard*.

        Returns:
            Maximum probability to reach `end` from `start`, or 0.0 if unreachable.
        """

        # Build adjacency list: node → [(neighbor, edge_prob), ...]
        adj = defaultdict(list)
        for (u, v), p in zip(edges, succProb):
            adj[u].append((v, p))
            adj[v].append((u, p))

        # Max-heap: store (-prob, node); start with 1.0 at 'start'
        pq, best = [(-1.0, start)], [0.0] * n
        best[start] = 1.0

        while pq:
            p, u = heappop(pq)
            p = -p
            if u == end:
                return p  # reached with max probability
            if p < best[u]:
                continue
            for v, w in adj[u]:
                new_p = p * w
                if new_p > best[v]:
                    best[v] = new_p
                    heappush(pq, (-new_p, v))
        return 0.0
