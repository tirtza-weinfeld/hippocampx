import random


class Solution:
    """
    Intuition:
        Randomly pick an integer from [0, n) excluding blacklisted values,
        with uniform probability and O(1) pick time.
    
        Core idea:
        - Let B = len(blacklist)
        - There are m = n - B valid numbers total
        - Sample uniformly from [0, m)
        - Remap only the blacklisted values that fall inside [0, m)
          to valid numbers in the tail [m, n)

    Example:
        n = 12
        blacklist = [1, 4, 6]
    
        m = 12 - 3 = 9
    
        Sample range: [0, 9)  -> {0,1,2,3,4,5,6,7,8}
        Tail range:   [9, 12) -> {9,10,11}
    
        Blacklisted values < m: {1,4,6}
    
        Build mapping:
            1 -> 9
            4 -> 10
            6 -> 11
    
        Final mapping:
            {1: 9, 4: 10, 6: 11}
    
        Picking:
            x = random.randrange(9)
            return map[x] if x is blacklisted else x
    
        This produces exactly:
            {0,2,3,5,7,8,9,10,11}
        each with probability 1/9.
    """

    def __init__(self, n: int, blacklist: list[int]):
        self.m = n - len(blacklist)
        black = set(blacklist)
        self.map: dict[int, int] = {}

        t = self.m                     # start of the tail range [m, n): next candidate replacement
        for b in blacklist:            # iterate over all blacklisted values
            if b < self.m:             # only blacklisted values in [0, m) can be sampled
                while t in black:      # skip tail values that are themselves blacklisted
                    t += 1
                self.map[b] = t        # remap b to the next valid tail value
                t += 1                 # advance so each remapping uses a unique value

    def pick(self) -> int:
        return self.map.get(x := random.randrange(self.m), x)
