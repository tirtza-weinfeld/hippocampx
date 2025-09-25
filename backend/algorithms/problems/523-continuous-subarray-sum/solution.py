def checkSubarraySumIsMultipleOfK(segments: list[int], k: int) -> bool:
    """
    Args:
        segments: List of integers representing trip segments.
        k: The divisor.
    
    Returns:
        True if such a subarray exists, False otherwise.
    """

    remainder_idx = {0: -1}
    prefix_remainder = 0

    for i, segment in enumerate(segments):
        prefix_remainder = (prefix_remainder + segment) % k
        if prefix_remainder in remainder_idx:
            if i - remainder_idx[prefix_remainder] > 1:
                return True
        else:
            remainder_idx[prefix_remainder] = i
    return False
