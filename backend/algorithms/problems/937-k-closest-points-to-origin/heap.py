import heapq


class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        d = [(x*x + y*y, (x,y)) for x, y in points]
        heapq.heapify(d)
        return [heapq.heappop(d)[1] for _ in range(k)]
