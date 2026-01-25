import random


class Solution:
    def __init__(self, w: list[int]):
        """
        Time Complexity:
            O(sum(weights))
        Space Complexity:
            O(sum(weights)):
            which may be inefficient for large weights. 
            A more efficient solution uses prefix sums + binary search (O(n) space)
        """
        self.p = []
        for i, weight in enumerate(w):
            self.p.extend([i] * (weight))

    def pickIndex(self) -> int:
        """
        Time Complexity:
            O(1)
        """
        index = random.randint(1, len(self.p) - 1)
        return self.p[index]

