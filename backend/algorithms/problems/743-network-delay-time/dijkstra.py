from heapq import heappush, heappop

class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        """
        Intuition:
            We track the shortest known time to reach every node from the source k:
            Initially, all distances are infinite except for k (0). 
            At each step, we pop the node with the smallest known distance from the heap.
            If we find a shorter path to one of its neighbors, we update (relax) that distance
            and push the new state into the heap.
            
            By the end, `dist[v]` holds the minimum time for the signal to reach each node `v`:
            The total network delay is the longest of these shortest times 
                i.e., `max(dist.values())`. If some node remains unreachable, return - 1.

        Time Complexity: 
            O(E log V)
        """

        # Build adjacency list: g[u] → list of (weight, neighbor)
        g = {i: [] for i in range(1, n + 1)}
        for u, v, w in times:
            g[u].append((w, v))

        # Initialize all distances to ∞ except the source node k
        dist = {i: float("inf") for i in g}
        dist[k] = 0

        # Min-heap priority queue → (current_distance, node)
        pq = [(0, k)]

        while pq:
            d, u = heappop(pq)
            if d > dist[u]: continue  # Skip outdated entries
                

            # Relax edges: try to improve shortest distance to each neighbor
            for w, v in g[u]:
                if (nd := d + w) < dist[v]:
                    dist[v] = nd
                    heappush(pq, (nd, v))

        # Return the maximum delay if reachable, else −1
        return ans if (ans := max(dist.values())) < float("inf") else -1