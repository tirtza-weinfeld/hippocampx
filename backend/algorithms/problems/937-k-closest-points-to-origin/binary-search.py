
class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:

        distance = [x*x + y*y for x, y in points] # compute squared distances

        lo, hi = 0, max(distance)
        while lo < hi: # binary search on distance threshold
            mid = (lo + hi) // 2
            if sum(d <= mid for d in distance) >= k:
                hi = mid
            else:
                lo = mid + 1

        res = [pt for pt, d in zip(points, distance) if d <= lo]# collect and return any k points within threshold
        return res[:k]
