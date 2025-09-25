def cheapest_flights_with_at_most_k_stops(
    n: int, flights: list[list[int]], src: int, dst: int, k: int
) -> int:
    """
    Time Complexity:
        O(kE)
        where `k` is the number of stops and `E` is the number of flights.
    """
    d = [float("inf")] * n
    d[src] = 0

    for _ in range(k + 1):
        tmp = d[:]
        for u, v, w in flights:
            if d[u] + w < tmp[v]:
                tmp[v] = d[u] + w
        d = tmp

    return d[dst] if d[dst] < float("inf") else -1
