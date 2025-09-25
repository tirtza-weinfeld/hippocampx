
import heapq

def dijkstra(graph: dict[str, dict[str, int]], s: str):
    """
    Time Complexity: 
        O((V + E) log V)

    Args:
        graph: A dictionary representing the graph.
        s: The source vertex.

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
