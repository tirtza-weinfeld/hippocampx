from collections import OrderedDict

class LRUCache:
    """
    Intuition:
        The LRU system is simple. It tracks *when* a book was last used.
    """
    def __init__(self, capacity: int):
        self.cache: OrderedDict[int, int] = OrderedDict()
        self.capacity = capacity

    def get(self, key: int) -> int:
        """
        When an item is accessed, it becomes the most recently used. We fetch the item and move it to the end of the `OrderedDict`.
        """
        if (val := self.cache.get(key)) is None:
            return -1
        self.cache.move_to_end(key)
        return val

    def put(self, key: int, value: int) -> None:
        """
         When an item is added or updated, it's also considered the most recently used and is moved to the end. If the cache exceeds its capacity, the item at the front of the OrderedDict (the least recently used) is removed.
        """
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
