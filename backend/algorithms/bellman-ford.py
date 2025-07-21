from collections import deque, defaultdict

def bellman_ford_classic(vertices:list[str], edges:list[tuple[str, str, float]], source:str)->dict[str, float]:
    """
    Classic Bellman-Ford with early exit.
    Raises on a reachable negative-weight cycle; otherwise returns dist[v] = δ(s,v).
    """
    
    d = [float("inf")] * (V := len(vertices))
    d[source] = 0

    # relax up to V-1 times, but return early if no update
    for _ in range(V - 1):
        updated = False
        for u, v, w in edges:
            if d[u] + w < d[v]:
                d[v] = d[u] + w
                updated = True
        if not updated:
            return d    # distances have stabilized—no negative cycles reachable

    # if we get here, we did all V-1 passes, so still need to check for cycles
    for u, v, w in edges:
        if d[u] + w < d[v]:
            raise Exception("Negative-weight cycle")

    return d



def bellman_ford_layered_dag(vertices: list[str], edges: list[tuple[str, str, float]], source: str) -> dict[str, float]:
    """
    Compute k-edge shortest-path distances and detect negative cycles via layered relaxation.
    1. δ₀(s,v): initialize distances (0 at source, ∞ elsewhere).
    2. For i = 1…V: perform one pass of edge-relaxation to compute δᵢ(s,v),
       the best cost using ≤ i edges.
    3. Identify any vertex v where δ_V(s,v) < δ_{V−1}(s,v) as a negative-cycle witness.
    4. Flood successors of those witnesses and mark their distances as −∞.

    Args:
        vertices: All hashable vertex identifiers.
        edges: Iterable of (u, v, weight) tuples.
        source: Starting vertex.
        
    Returns:
        A dict mapping each vertex to its true shortest-path cost from `source`,
        or float('-inf') if it’s reachable from a negative-weight cycle.
    """

    # 1) Initialize
    d = {v: float("inf") for v in vertices}
    d[source], V = 0, len(vertices)

    # 2) Layered relaxation: starting from δ₀, do V passes to compute δ₁…δ_V
    for k in range(V):  # k = 0…V-1
        d_k = {**d}  # snapshot of δ_k
        for u, v, w in edges:
            if d[u] + w < d_k[v]:
                d_k[v] = d[u] + w
        d = d_k  # now holds δ_{k+1}

    # 3) Identify “witnesses” to negative cycles:
    #    any v for which an extra relaxation is still possible
    witnesses = {v for u, v, w in edges if d[u] + w < d[v]}

    if not witnesses:
        return d

    # 4) Build adjacency list for negative-cycle propagation
    adj = defaultdict(list)
    for u, v, _ in edges:
        adj[u].append(v)

    # 5) DFS to propagate −∞ to all vertices reachable from any witness
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


def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:

    d = [float("inf")] * n
    d[src] = 0

    for _ in range(k + 1):
        tmp = d[:]
        for u, v, w in flights:
            if d[u] + w < tmp[v]:
                tmp[v] = d[u] + w
        d = tmp

    return d[dst] if d[dst] < float("inf") else -1


def maxProbability(n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
    """

    Bellman-Ford variant to maximize product of probabilities.
    Each node tracks the maximum probability to reach it from `start`.

    Args:
        n: number of nodes
        edges: edges[i] = [u, v] is an undirected edge connecting the nodes u and v with a probability of success of traversing that edge succProb[i].
        succProb: list of probabilities, e.g. [0.5,0.5,0.2],

    """
    prob = [0.0] * n # rob[i] stores max probability to reach node i
    prob[start] = 1.0  # Start with full certainty

    for _ in range(n - 1):  # Perform up to n-1 rounds of relaxation
        updated = False
        for (u, v), p in zip(edges, succProb):
            if prob[u] * p > prob[v]:  # Try to improve v through u
                prob[v] = prob[u] * p
                updated = True
            if prob[v] * p > prob[u]:  # Try to improve u through v (undirected graph)
                prob[u] = prob[v] * p
                updated = True
        if not updated:
            break  # Early exit if no updates in this round

    return prob[end]
