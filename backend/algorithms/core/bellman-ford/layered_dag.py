
from collections import defaultdict


def bellman_ford_layered_dag(
    vertices: list[str], edges: list[tuple[str, str, float]], source: str
) -> dict[str, float]:
    """
    Intuition:
        Compute k-edge shortest-path distances and detect negative cycles via layered relaxation.
        1. $\delta_0(s,v)$: initialize distances (0 at source, $\infty$ elsewhere).
        2. For $i = 1 \ldots V$: perform one pass of edge-relaxation to compute $\delta_i(s,v)$,
           the best cost using $\leq i$ edges.
        3. Identify any vertex v where $\delta_V(s,v) < \delta_{V-1}(s,v)$ as a negative-cycle witness.
        4. Flood successors of those witnesses and mark their distances as $-\infty$.

    Args:
        vertices: All hashable vertex identifiers.
        edges: Iterable of (u, v, weight) tuples.
        source: Starting vertex.

    Returns:
        A dict mapping each vertex to its true shortest-path cost from `source`,
          or float('-inf') if it's reachable from a negative-weight cycle.
    """

    # 1) Initialize
    d = {v: float("inf") for v in vertices}
    d[source], V = 0, len(vertices)

    # 2) Layered relaxation: starting from $\delta_0$, do V passes to compute $\delta_1 \ldots \delta_V$
    for k in range(V):  # k = 0…V-1
        d_k = {**d}  # snapshot of $\delta_k$
        for u, v, w in edges:
            if d[u] + w < d_k[v]:
                d_k[v] = d[u] + w
        d = d_k  # now holds $\delta_{k+1}$

    # 3) Identify "witnesses" to negative cycles:
    #    any v for which an extra relaxation is still possible
    witnesses = {v for u, v, w in edges if d[u] + w < d[v]}

    if not witnesses:
        return d

    # 4) Build adjacency list for negative-cycle propagation
    adj = defaultdict(list)
    for u, v, _ in edges:
        adj[u].append(v)

    # 5) DFS to propagate $-\infty$ to all vertices reachable from any witness
    stack = list(witnesses)
    reachable = set(witnesses)

    while stack:
        u = stack.pop()
        d[u] = float("-inf")
        for v in adj[u]:
            if v not in reachable:
                reachable.add(v)
                stack.append(v)

    return d
