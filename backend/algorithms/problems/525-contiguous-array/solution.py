import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..','325-maximum-size-subarray-sum-equals-k'))
from solution import maxSizeSubarraySumEqualsK


def findMaxLengthOfBalancedSubarray(segments: list[int]) -> int:
    """
    Args:
        segments: List of integers (positive for forward, negative/zero for backward).
    
    Returns:
        The length of the longest balanced subarray.
    """
    
    normalized_segments = [1 if num > 0 else -1 for num in segments]
    return maxSizeSubarraySumEqualsK(normalized_segments, 0)
