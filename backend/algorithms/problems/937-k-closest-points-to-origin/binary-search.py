class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        r"""
        Intuition:
        Binary search for the smallest value `lo` such that at least `k` squared distances are `<= lo`
        
        Time complexity:
        $O(n \log D)$:
            Let $n =\text{len(points)}$ and $D = \max(x^2 + y^2)$.
            Each binary-search step scans all $n$ distances.

        """
        distance = [x * x + y * y for x, y in points]      # squared distances of points

        lo, hi = 0, max(distance)                          # possible range of squared distances
        while lo < hi:
            mid = (lo + hi) // 2                           # candidate squared-distance value
            if sum(d <= mid for d in distance) >= k:       # how many distances are <= mid
                hi = mid                                   # mid is large enough
            else:
                lo = mid + 1                               # mid is too small

        return [p for p, d in zip(points, distance) if d <= lo]  # points with distance <= lo
