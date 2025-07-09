def bellman_ford_lecture(n, edges, s):
    inf = float('inf')
    d = [inf] * n
    d[s] = 0
    for _ in range(n):
        nd = d.copy()
        for u, v, w in edges:
            nd[v] = min(nd[v], d[u] + w)
        d = nd
    bad = {v for u, v, w in edges if d[u] + w < d[v]}
    from collections import deque, defaultdict
    g = defaultdict(list)
    for u, v, _ in edges:
        g[u].append(v)
    q = deque(bad)
    vis = set(bad)
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis:
                vis.add(v); q.append(v)
    return [float('-inf') if i in vis else d[i] for i in range(n)]

def bellman_ford_classic_recitation(adj, w, s):
    
    d = [float("inf")] * (V:=len(adj))
    d[s] = 0

    for _ in range(V - 1):
        for u in range(V):
            for v in adj[u]:
                if d[u] + w(u, v) < d[v]:
                    d[v] = d[u] + w(u, v)

    for u in range(V):
        for v in adj[u]:
            if d[u] + w(u, v) < d[v]:
                raise Exception("Negative-weight cycle")
    
    return d

def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    
    d = [float('inf')] * n
    d[src] = 0

    for _ in range(k + 1):
        tmp = d[:]
        for u, v, w in flights:
            if d[u] + w < tmp[v]:
                tmp[v] = d[u] + w
        d = tmp

    return d[dst] if d[dst] < float('inf') else -1


def maxProbability(n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
    """

    Bellman-Ford variant to maximize product of probabilities.
    Each node tracks the maximum probability to reach it from `start`.

    Args:
        n: number of nodes
        edges: edges[i] = [u, v] is an undirected edge connecting the nodes u and v with a probability of success of traversing that edge succProb[i].
        succProb: list of probabilities, e.g. [0.5,0.5,0.2],
        start: start node
        end: end node

    Variables:
    •	prob: prob[i] stores max probability to reach node i
    •   prob = [0.0] * n  # Initialize all probabilities to 0
    •	prob[start] = 1.0  # Starting node has probability 1 (certainty)
    •	prob[end] is the final result

    Expressions:
    """
    prob = [0.0] * n
    prob[start] = 1.0  # Start with full certainty

    for _ in range(n - 1):# Perform up to n-1 rounds of relaxation
        updated = False
        for (u, v), p in zip(edges, succProb):
            if prob[u] * p > prob[v]: # Try to improve v through u
                prob[v] = prob[u] * p
                updated = True
            if prob[v] * p > prob[u]: # Try to improve u through v (undirected graph)
                prob[u] = prob[v] * p
                updated = True
        if not updated:
            break # Early exit if no updates in this round

    return prob[end]
