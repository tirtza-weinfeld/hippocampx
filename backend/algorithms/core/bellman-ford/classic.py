



def bellman_ford_classic(
    vertices: list[str], edges: list[tuple[str, str, float]], source: str
) -> dict[str, float]:
    """
    Intuition: 
        Classic Bellman-Ford with early exit:
        Raises on a reachable negative-weight cycle; 
        otherwise returns dist[v] = δ(s,v).

    Expressions:
        'range(V - 1)': relax up to V-1 times, but return early if no update
        'if not updated':  distances have stabilized—no negative cycles reachable
    """

    d = [float("inf")] * (V := len(vertices))
    d[source] = 0

    for _ in range(V - 1):
        updated = False
        for u, v, w in edges:
            if d[u] + w < d[v]:
                d[v] = d[u] + w
                updated = True
        if not updated:
            return d

    # if we get here, we did all V-1 passes, so still need to check for cycles
    for u, v, w in edges:
        if d[u] + w < d[v]:
            raise Exception("Negative-weight cycle")

    return d
