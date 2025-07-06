from collections import defaultdict
import heapq

def dijkstra(graph: dict[str, dict[str, int]], s: str):
    """
    Dijkstra's algorithm for finding the shortest path in a non-negative weighted graph.
    Time complexity: O((V + E) log V)

    Args:
        graph: A dictionary representing the graph.
        s: The source vertex.

    Returns:
    """

    d = {v: float('inf') for v in graph} | {s: 0}
    p = {v: None for v in graph}

    pq = [(0, s)]

    while pq:
        d_u, u = heapq.heappop(pq)
        if d_u > d[u]:
            continue
        for v ,w in graph[u]:
            if (weight := d_u + w) < d[v]:
                d[v], p[v] = weight, u
                heapq.heappush(pq, (weight, v))

    return d, p



def networkDelayTime2(times: list[list[int]], n: int, k: int) -> int:

    graph = {v: [] for v in range(1, n + 1)}
    for u, v, w in times:
        graph[u].append((v, w))

    d = {v: float("inf") for v in graph} | {k: 0}

    pq = [(0, k)]

    while pq:
        d_u, u = heapq.heappop(pq)
        if d_u > d[u]:
            continue
        for v, w in graph[u]:
            if (weight := d_u + w) < d[v]:
                d[v] = weight
                heapq.heappush(pq, (weight, v))

    return m if (m := max(d.values())) != float("inf") else -1



def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
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


