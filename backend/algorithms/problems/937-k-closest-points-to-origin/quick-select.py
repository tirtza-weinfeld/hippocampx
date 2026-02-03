import random


class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        """
        Intuition:
            Choose a pivot index in the current range `[lo, hi]`
            Move the pivot element to the end (index hi) to simplify partitioning
            Partition the range `[lo, hi)` so that:
                all points with `distance <= pivot` are moved to the left
                all points with `distance > pivot` stay on the right
            Swap the pivot from the end into its final position `i`

            After partitioning:
            index `i` is the final position of the pivot
            all indices `< i` have distance `<= pivot`
            all indices `> i` have distance `> pivot`

            Decision step:
            if `i == k - 1`: the k closest points are in positions `[0 .. k - 1]`, stop
            if `i <  k - 1`: the k-th point lies to the right, discard `[lo .. i]`
            if `i >  k - 1`: the k-th point lies to the left, discard `[i .. hi]`

            Repeat until the pivot lands at index `k - 1`.

        Time complexity:
            Expected time: $O(n)$, worst: $O(n^2)$
            Each partition step scans the current range once: $O(n)$.
            After partitioning, only the side that can contain the k-th element is kept;
            the other side is discarded permanently.

            With a random pivot, the remaining range shrinks by a constant fraction
            in expectation, so the total work is:

            $n + n/2 + n/4 + \dots = O(n)$

            Worst case occurs when the pivot is always extreme, giving:
            $n + (n-1) + \dots + 1 = O(n^2)$

        """
        lo, hi = 0, len(points) - 1

        while True:
            p = random.randrange(lo, hi + 1)  # random pivot index in [lo, hi]
            points[p], points[hi] = points[hi], points[p]  # move pivot to end
            px, py = points[hi]
            pivot = px * px + py * py  # pivot squared distance

            i = lo  # next slot for <= pivot
            for j in range(lo, hi):
                x, y = points[j]
                if x * x + y * y <= pivot:
                    points[i], points[j] = points[j], points[i]
                    i += 1
            points[i], points[hi] = points[hi], points[i]  # pivot lands at i

            if i == k - 1:
                return points[:k]  # first k are the k closest
            if i < k - 1:
                lo = i + 1  # keep right side only
            else:
                hi = i - 1  # keep left side only
