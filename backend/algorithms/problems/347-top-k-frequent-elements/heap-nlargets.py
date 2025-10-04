import heapq
from collections import Counter


def topKFrequent(nums: list[int], k: int) -> list[int]:
    """
    using built-in function heapq.nlargest

    Expressions:
        'freq.keys()' : iterable → here freq.keys(), i.e. all unique numbers.
        'key=freq.get' : key → function that gives a value to rank by. freq.get(x) = frequency of x.

    Time Complexity:
        O(n log k)
    """
    freq = Counter(nums)
    return heapq.nlargest(k, freq.keys(), key=freq.get)
