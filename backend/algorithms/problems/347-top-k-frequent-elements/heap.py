import heapq
from collections import Counter


def topKFrequent(nums: list[int], k: int) -> list[int]:
    """
    Time Complexity:
        O(n log k)

    """
    freq ,h= Counter(nums), []
    for num, f in freq.items():
        heapq.heappush(h, (f, num))
        if len(h) > k:
            heapq.heappop(h)
    
    return [num for _, num in h]




