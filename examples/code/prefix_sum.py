from collections import defaultdict


def maxSubArrayLen(segments: list[int], k: int) -> int:
    """
    **1**
    Find the maximum length of a subarray that sums to exactly k.
    LeetCode 325: Maximum Size Subarray Sum Equals k
    https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/
    Args:
        segments: List of integers representing trip segments.
        k: Target sum.
    Returns:
        The length of the longest subarray with sum == k.
    """

    marker_idx = {0: -1}
    prefix_sum = max_length = 0

    for i, segment in enumerate(segments):

        prefix_sum += segment

        if (target_marker := prefix_sum - k) in marker_idx:
            max_length = max(max_length, i - marker_idx[target_marker])

        if prefix_sum not in marker_idx:
            marker_idx[prefix_sum] = i

    return max_length


def subarraySum(segments: list[int], k: int) -> int:
    """
    **2**
    Count the number of subarrays that sum to exactly k.
    LeetCode 560: Subarray Sum Equals K
    https://leetcode.com/problems/subarray-sum-equals-k/
    Args:
        segments: List of integers representing trip segments.
        k: Target sum.
    Returns:
        The count of subarrays with sum == k.
    """

    marker_frequency = defaultdict(int, {0: 1})
    prefix_sum = count = 0

    for segment in segments:
        prefix_sum += segment
        count += marker_frequency[prefix_sum - k]
        marker_frequency[prefix_sum] += 1
    return count


def findMaxLength(segments: list[int]) -> int:
    """
    **3**
    Find the maximum length of a contiguous subarray with an equal number of positive and negative values.
    LeetCode 525: Contiguous Array
    https://leetcode.com/problems/contiguous-array/
    Args:
        segments: List of integers (positive for forward, negative/zero for backward).
    Returns:
        The length of the longest balanced subarray.
    """
    normalized_segments = [1 if num > 0 else -1 for num in segments]
    return maxSubArrayLen(normalized_segments, 0)


def checkSubarraySum(segments: list[int], k: int) -> bool:
    """
    **4**
    Check if the array contains a subarray of at least length 2 whose sum is a multiple of k.
    LeetCode 523: Continuous Subarray Sum
    https://leetcode.com/problems/continuous-subarray-sum/
    Args:
        segments: List of integers representing trip segments.
        k: The divisor.
    Returns:
        True if such a subarray exists, False otherwise.
    """

    remainder_to_index = {0: -1}
    prefix_remainder = 0

    for i, segment in enumerate(segments):
        prefix_remainder = (prefix_remainder + segment) % k
        if prefix_remainder in remainder_to_index:
            if i - remainder_to_index[prefix_remainder] > 1:
                return True
        else:
            remainder_to_index[prefix_remainder] = i
    return False


def subarraysDivByK(segments: list[int], k: int) -> int:
    """
    **5**
    Count the number of subarrays whose sum is divisible by k.
    LeetCode 974: Subarray Sums Divisible by K
    https://leetcode.com/problems/subarray-sums-divisible-by-k/
    Args:
        segments: List of integers representing trip segments.
        k: The divisor.
    Returns:
        The count of subarrays with sum divisible by k.
    """

    remainder_frequency = defaultdict(int, {0: 1})
    prefix_remainder = count = 0

    for segment in segments:
        prefix_remainder = (prefix_remainder + segment) % k
        count += remainder_frequency[prefix_remainder]
        remainder_frequency[prefix_remainder] += 1
    return count


def minSubarray(segments: list[int], p: int) -> int:
    """
    **6**
    Find the length of the shortest subarray to remove so that the sum of the remaining elements is divisible by p.
    LeetCode 1590: Make Sum Divisible by P
    https://leetcode.com/problems/make-sum-divisible-by-p/
    Args:
        segments: List of integers representing trip segments.
        p: The divisor.
    Returns:
        The length of the shortest subarray to remove, or -1 if not possible.
    """
    total_remainder = sum(segments) % p
    if total_remainder == 0:
        return 0

    remainder_to_index = {0: -1}
    prefix_remainder, min_length = 0, len(segments)

    for i, segment in enumerate(segments):
        prefix_remainder = (prefix_remainder + segment) % p
        need = (prefix_remainder - total_remainder + p) % p
        if need in remainder_to_index:
            min_length = min(min_length, i - remainder_to_index[need])
        remainder_to_index[prefix_remainder] = i

    return min_length if min_length < len(segments) else -1


def getModifiedArray(length: int, updates: list[list[int]]) -> list[int]:
    """
    **7**
    Apply a list of range updates to an array and return the modified array.
    LeetCode 370: Range Addition
    https://leetcode.com/problems/range-addition/
    Args:
        length: The number of days in the itinerary.
        updates: List of [start_day, end_day, change_in_km] updates.
    Returns:
        The final daily travel plan after all updates.
    """

    delta = [0] * (length + 1)

    for start_day, end_day, change_in_km in updates:
        delta[start_day] += change_in_km
        delta[end_day + 1] -= change_in_km

    prefix_sum = 0
    return [prefix_sum := prefix_sum + change for change in delta[:length]]


def numberOfArrays(differences: list[int], lower: int, upper: int) -> int:
    """
    **8**
    Count the number of valid starting values for a hidden sequence given the differences and bounds.
    LeetCode 2145: Count the Hidden Sequences
    https://leetcode.com/problems/count-the-hidden-sequences/
    Args:
        differences: List of daily changes (trip segments).
        lower: Lower bound for any marker on the highway.
        upper: Upper bound for any marker on the highway.
    Returns:
        The number of valid starting values.
    """

    prefix_sum = min_marker = max_marker = 0

    for diff in differences:
        prefix_sum += diff
        min_marker = min(min_marker, prefix_sum)
        max_marker = max(max_marker, prefix_sum)

    return max(0, (upper - max_marker) - (lower - min_marker) + 1)
