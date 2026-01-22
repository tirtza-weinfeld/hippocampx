

def splitArray(nums: list[int], k: int) -> int:
    """

    Intuition:
        We are minimizing the maximum subarray sum after splitting `nums` into `k`
        contiguous parts. If we fix a candidate maximum sum `max_sum`, we can greedily
        scan left-to-right and create a new subarray only when adding the next element
        would exceed `max_sum`. This greedy strategy minimizes the number of parts.
        The feasibility is monotonic: if a given `max_sum` works, any larger value
        will also work, so binary search applies.

    Time Complexity:
        O(n log S):
        where `n = len(nums`) and `S = sum(nums) - max(nums)`
        (binary search over the answer space, O(n) greedy check per step).


    """

    def can(max_sum: int) -> bool:
        """
        Greedy feasibility check:
        count how many subarrays are needed if no subarray exceeds max_sum
        """
        parts = curr = 0
        for x in nums:
            if curr + x > max_sum:
                parts += 1   # must start a new subarray
                curr = 0
            curr += x
        return parts + 1 <= k  # +1 for the final subarray

    lo, hi = max(nums), sum(nums)  # answer bounds
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid     # mid is feasible; try smaller maximum
        else:
            lo = mid + 1 # mid is too small; increase lower bound
    return lo
