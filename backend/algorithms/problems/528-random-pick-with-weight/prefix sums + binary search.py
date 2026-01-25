import bisect
import random


class Solution:

    def __init__(self, weights: list[int]):
        """
        Intuition:
            Prefix sums:
                Each weight `weights[i]` represents how "wide" index `i` should be on a number line.
                Build prefix sums so that:
                    `prefix[i] = weights[0] + ... + weights[i]`
                This turns the array of weights into contiguous segments on [1, total].
                Example: 
                    weights = [2, 5, 3] -> `prefix = [2, 7, 10]`
                    Segments:
                        1-2   → index 0
                        3-7   → index 1
                        8-10  → index 2
                To pick an index with probability proportional to its weight:
                    Draw a random integer `target ∈ [1, total]`.
                    Find the first `prefix[i] ≥ target`.
                    That `i` is the index whose segment contains `target`.
                Bigger weight → bigger segment → higher chance of being hit.

        Time Complexity:
            O(n)
        Space Complexity:
            O(n)
            Store only the prefix sum array of length n

         """
        self.prefix, total = [], 0
        for w in weights:
            total += w
            self.prefix.append(total)
        self.total = total

    def pickIndex(self) -> int:
        """
        Time Complexity:
            O(log n):
            Binary search via bisect_left on the prefix array
        Expressions:
            'random.randint(1, self.total)': pick a random integer in [1, total]
            'bisect.bisect_left': find the first index such that `prefix[index] >= The random drawn integer`

        """
        return bisect.bisect_left(self.prefix, random.randint(1, self.total))
