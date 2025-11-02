
from collections import defaultdict
import heapq


def cheapest_flights_with_at_most_k_stops( flights: list[list[int]], src: int, dst: int, k: int) -> int:
    """

    Variables:
        pq: Priority queue to store the state (cost, city, stops_taken)
        min_stops: Tracks the minimum stops to reach each city

    """

    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))

    pq, min_stops = [(0, src, 0)], {}
    
    while pq:
        cost, city, stops = heapq.heappop(pq)

        # If we've already found a path to this city using fewer or equal stops, skip.
        # A path with fewer stops must have been cheaper or equal due to PQ ordering.
        if stops > min_stops.get(city, float("inf")): continue
        if city == dst: return cost

        # Record the new minimum stops to reach this city
        min_stops[city] = stops
        if stops <= k:
            for neighbor, price in graph[city]:
                heapq.heappush(pq, (cost + price, neighbor, stops + 1))
    return -1

