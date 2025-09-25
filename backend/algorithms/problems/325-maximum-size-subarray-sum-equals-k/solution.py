def maxSizeSubarraySumEqualsK(segments: list[int], k: int) -> int:
    """
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
