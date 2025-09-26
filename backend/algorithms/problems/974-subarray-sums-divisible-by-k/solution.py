from collections import defaultdict

def subarraysSumIsDivisibleByK(segments: list[int], k: int) -> int:
    """
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
