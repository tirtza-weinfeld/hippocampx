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
    """
    Given `n` nodes labeled `1` through `n` and directed travel times between them, 
    find the minimum time for a signal starting at node `k` to reach *all* nodes. 
    If impossible, return -1
    [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
    Args:
        times: list of lists of integers representing the edges and their weights
        n: number of nodes
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






def minimumEffortPath(heights: list[list[int]]) -> int:
    """
    Find a path from the top-left to the bottom-right of a height grid that minimizes the "effort".
    Effort is the single largest height difference between any two adjacent cells on the path.
    [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)
    Args:
        heights: 2D list of integers representing the heights of the cells
    Returns:
        minimum effort to reach the bottom-right cell
    Variables:
    - pq:  Priority queue stores (max_effort_on_path, r, c)
    - resolved: set to store the positions that have been resolved
    """

    R, C = len(heights), len(heights[0])
    pq, resolved = [(0, 0, 0)], set()

    while pq:
        effort, r, c = heapq.heappop(pq)
        if (r, c) in resolved: continue
        if (r, c) == (R - 1, C - 1): return effort
        resolved.add((r, c))

        for nr, nc in [(r, c + 1), (r, c - 1), (r + 1, c), (r - 1, c)]:
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in resolved:
                neighbor_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                heapq.heappush(pq, (neighbor_effort, nr, nc))


def swimInWater(grid: list[list[int]]) -> int:
    """
    You are given an `N x N` grid of elevations. Find the minimum "time" `t` to travel from `(0, 0)` to `(N-1, N-1)`. 
    You can only move between adjacent cells if their elevation is less than or equal to the time `t`
    [778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/)
    Args:
        grid: 2D list of integers representing the elevations of the cells
    Returns:
        minimum time to travel from `(0, 0)` to `(N-1, N-1)`
    Variables:
    - pq:  Priority queue stores (max_elevation_on_path, r, c)
    - resolved: set to store the cells for which we have found the minimum time required to reach them
    """

    n=len(grid)
    pq, resolved = [(grid[0][0], 0, 0)], set()

    while pq:
        time, r, c = heapq.heappop(pq)
        if (r, c) in resolved:continue
        if (r, c) == (n - 1, n - 1):return time
        resolved.add((r, c))

        for nr, nc in [(r, c + 1), (r, c - 1), (r + 1, c), (r - 1, c)]:
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in resolved:
                bottleneck_time = max(time, grid[nr][nc])
                heapq.heappush(pq, (bottleneck_time, nr, nc))





def findCheapestPriceDijkstra( flights: list[list[int]], src: int, dst: int, k: int) -> int:
    """
    Variables:
    - pq: Priority queue to store the state (cost, city, stops_taken)
    - min_stops: Tracks the minimum stops to reach each city
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




def dijkstraShortestPath(grid: list[list[int]], k: int) -> int:

    """
    Finds the shortest path using Dijkstra's algorithm.
    Note: This is less efficient than A* for this problem.

    Variables:
    - pq: (g_cost, r, c, k_rem), The priority uses g_cost (steps) itself. No heuristic is used.
    - steps: The number of steps taken so far (g_cost)
    - max_k: max_k[r][c] stores the max eliminations we have at cell (r,c)


    Expressions:
    - 'heapq.heappush(pq, (steps + 1, nr, nc, new_k))': The priority is simply the new step count.No heuristic is added, which is the only difference from the A* implementation.
    - 'heapq.heappop(pq)': Pop the path with the lowest g_cost (steps) so far
    - 'k_rem < max_k[r][c]': Prune paths that are suboptimal for a given cell

    """

    rows, cols = len(grid), len(grid[0])
    if k >= rows + cols - 3:
        return rows + cols - 2
  
    pq = [(0, 0, 0, k)]
    
    max_k = [[-1] * cols for _ in range(rows)]
    max_k[0][0] = k

    while pq:
        
        steps, r, c, k_rem = heapq.heappop(pq)
        
        if (r, c) == (rows - 1, cols - 1):
            return steps
        
        if k_rem < max_k[r][c]:
            continue

        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            if 0 <= (nr:= r + dr) < rows and 0 <= (nc:= c + dc) < cols:
                if (new_k:= k_rem - grid[nr][nc]) > max_k[nr][nc]:
                    max_k[nr][nc] = new_k
                    heapq.heappush(pq, (steps + 1, nr, nc, new_k))
                    
    return -1