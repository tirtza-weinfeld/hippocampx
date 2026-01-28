import bisect
import random


class Solution:
    def __init__(self, rectangles: list[list[int]]):
        p, s = [], 0
        for a, b, x, y in rectangles:
            s += (x - a + 1) * (y - b + 1)
            p.append(s)
        self.prefix, self.total, self.rectangles = p, s, rectangles

    def pick(self) -> list[int]:
        r = bisect.bisect_right(self.prefix, random.randrange(self.total))
        a, b, x, y = self.rectangles[r]
        return [random.randint(a, x), random.randint(b, y)]
