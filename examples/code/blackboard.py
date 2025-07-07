from collections import defaultdict
import heapq


class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:

        graph = defaultdict(list)
        for u, v, price in flights:
            graph[u].append((v, price))

        # State in PQ: (cost, city, stops_taken)
        pq = [(0, src, 0)]

        # Tracks the minimum stops to reach each city
        min_stops = {}

        while pq:
            cost, city, stops = heapq.heappop(pq)

            # If we've already found a path to this city using fewer or equal stops, skip.
            # A path with fewer stops must have been cheaper or equal due to PQ ordering.
            if stops > min_stops.get(city, float("inf")):
                continue

            # Record the new minimum stops to reach this city
            min_stops[city] = stops

            if city == dst:
                return cost

            if stops <= k:
                for neighbor, price in graph[city]:
                    heapq.heappush(pq, (cost + price, neighbor, stops + 1))

        return -1
