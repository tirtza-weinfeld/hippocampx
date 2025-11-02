

from heapq import heappush, heappop
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        """
        Intuition:
            The signal starts at node k and spreads through the network.
            Each time we pop a node from the heap, we know this is the earliest
            possible moment the signal can reach it — its shortest travel time.
            We mark it as finalized and push its neighbors with updated times.
            When all nodes are finalized, the last recorded time is the total delay.
            If not all nodes can be reached, return -1.

        Time Complexity:
            O(E log V):
            E is the number of edges (the length of the input list `times`)
            V is the number of vertices (the number of nodes `n`)

            By substituting these into the standard Dijkstra complexity formula, O(E log V), you get *O(len(times)logn)*.

        Args:
            times: list of lists of integers representing the edges and their weights
            k: starting node

        Returns:
            minimum time for a signal starting at node `k` to reach *all* nodes or -1 if impossible
        """

        # Build adjacency list: u → [(v, w)]
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))

        # Min-heap for (elapsed_time, node)
        pq, finalized, time = [(0, k)], set(), 0

        while pq:
            t, node = heappop(pq)
            if node in finalized:     # skip if already finalized
                continue
            finalized.add(node)
            time = t                  # current shortest time to reach this node

            # Explore neighbors and push their cumulative travel times
            for neighbor, travel_time in adj[node]:
                if neighbor not in finalized:
                    heappush(pq, (time + travel_time, neighbor))

        # Return total delay if all nodes reached, else -1
        return time if len(finalized) == n else -1