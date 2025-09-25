from collections import defaultdict
import heapq


def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    """
    Time Complexity:
        O(E log V):
        E is the number of edges (the length of the input list `times`)
        V is the number of vertices (the number of nodes `n`)
        
        By substituting these into the standard Dijkstra complexity formula, O(E log V), you get O(len(times) log n).

    Args:
        times: list of lists of integers representing the edges and their weights
        k: starting node

    Returns:
        minimum time for a signal starting at node `k` to reach *all* nodes or -1 if impossible
    """

    adj = defaultdict(list)
    for u, v, w in times:
        adj[u].append((v, w))
    pq, finalized, time = [(0, k)], set(), 0
    while pq:
        t, node = heapq.heappop(pq)
        if node in finalized:
            continue
        finalized.add(node)
        time = t
        for neighbor, travel_time in adj[node]:
            if neighbor not in finalized:
                heapq.heappush(pq, (time + travel_time, neighbor))
    return time if len(finalized) == n else -1


