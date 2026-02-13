from collections import defaultdict


def subarraySumEqualsK(nums: list[int], k: int) -> int:
    """
    Args:
        nums: List of integers representing trip segments.
        k: Target sum.
    
    Returns:
        The count of subarrays with sum == k.
    Variables:
        s = running prefix sum
    Expressions:
        '{0: 1}': prefix sum 0 seen once (represents "empty prefix"), this allows subarrays starting at index 0 to count  
        'freq[s - k]': number of earlier prefixes that make current subarray sum = k  

    """

    s = count = 0
    freq = defaultdict(int, {0: 1})

    for x in nums:
        s += x                                        # update prefix sum
        count += freq[s - k]                          # number of earlier prefixes that make current subarray sum = k
        freq[s] += 1                                  # record current prefix sum
    return count                                      # total number of subarrays with sum k
