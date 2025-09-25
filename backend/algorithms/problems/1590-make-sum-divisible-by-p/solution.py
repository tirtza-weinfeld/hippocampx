def minSubarrayToMakeSumDivisibleByP(segments: list[int], p: int) -> int:
    """
    Args:
        segments: List of integers representing trip segments.
        p: The divisor.
    
    Returns:
        The length of the shortest subarray to remove, or -1 if not possible.
    """

    total_remainder = sum(segments) % p
    if total_remainder == 0:
        return 0

    remainder_idx = {0: -1}
    prefix_remainder, min_length = 0, len(segments)

    for i, segment in enumerate(segments):
        prefix_remainder = (prefix_remainder + segment) % p
        need = (prefix_remainder - total_remainder + p) % p
        if need in remainder_idx:
            min_length = min(min_length, i - remainder_idx[need])
        remainder_idx[prefix_remainder] = i

    return min_length if min_length < len(segments) else -1
