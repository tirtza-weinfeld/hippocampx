from collections import defaultdict

def subarraySumEqualsK(segments: list[int], k: int) -> int:
    """
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
