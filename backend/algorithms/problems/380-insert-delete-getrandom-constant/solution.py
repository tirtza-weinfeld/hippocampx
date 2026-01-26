import random


class RandomizedSet:
    def __init__(self):
        """Initialize empty set with a list for values and a dict for index lookup."""
        self.values: list[int] = []
        self.index: dict[int, int] = {}

    def insert(self, value: int) -> bool:
        """Insert value if not present. Returns True if inserted, False if already exists."""
        if value in self.index:
            return False

        self.index[value] = len(self.values)
        self.values.append(value)
        return True

    def remove(self, value: int) -> bool:
        """
        Remove value if present. Returns True if removed, False if not found.

        To achieve O(1) removal from a list, swaps the target value with the last
        element, updates the swapped element's index in the dict, then pops from
        the end of the list.
        """
        if value not in self.index:
            return False

        self.values[(i:=self.index[value])] = (v:=self.values[-1])
        self.values.pop()

        self.index[v] = i
        del self.index[value]

        return True

    def getRandom(self) -> int:
        """Return a random element from the set. Each element has equal probability."""
        return random.choice(self.values)
