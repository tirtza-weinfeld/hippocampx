import heapq


def kClosest(points: list[list[int]], k: int) -> list[list[int]]:
    """
    Time complexity:
    $O(n k \log n)$:
        Building the heap from all $n$ points takes $O(n)$ time.
        Each pop removes the smallest distance in $O(\log n)$ time.
        We perform exactly $k$ pops, so the total work is: $O(n + k \log n)$
        This approach avoids full sorting ($O(n \log n)$) by only extracting the $k$ smallest elements.
    """
    d = [(x * x + y * y, (x, y)) for x, y in points]
    heapq.heapify(d)
    return [heapq.heappop(d)[1] for _ in range(k)]
