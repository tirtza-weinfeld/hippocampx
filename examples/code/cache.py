from collections import defaultdict, OrderedDict


class LRUCache:
    """
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



class LFUCache:
    """
    The LFU system is more sophisticated. It tracks not just *when* a book was last used, but also *how often* it has been used.
    """
    def __init__(self, capacity: int):
        self.capacity    = capacity
        self.cache       = {}  # key → value
        self.freq        = {}  # key → freq
        self.buckets     = defaultdict(OrderedDict)  # freq → keys in LRU order
        self.minfreq     = 0

    def _bump(self, key: int):
        """Move key from freq f to f+1."""
        f = self.freq[key]
        # remove from old bucket
        del self.buckets[f][key]
        if not self.buckets[f]:
            del self.buckets[f]
            if self.minfreq == f:
                self.minfreq += 1
                
        # Promote the book to the next shelf up, placing it by the chair.
        self.freq[key] +=1 # self.freq[key] = f + 1
        self.buckets[f + 1][key] = None

    def get(self, key: int) -> int:
        """
        When an item is accessed (get or put), its frequency count is incremented, and it moves from its current frequency bucket to the next, becoming the most recent item in that new bucket. For eviction, we remove the least recently used item from the lowest frequency bucket.
        """
        if key not in self.cache:
            return -1
        self._bump(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        """
        When an item is added or updated, its frequency count is set to 1, and it's added to the lowest frequency bucket. If the cache exceeds its capacity, the least recently used item from the lowest frequency bucket is removed.
        """
        if self.capacity <= 0:
            return

        if key in self.cache:
            self.cache[key] = value
            self._bump(key)
            return

        # Evict from the far end of the least popular shelf.
        if len(self.cache) >= self.capacity:
            old_key, _ = self.buckets[self.minfreq].popitem(last=False)
            del self.cache[old_key]
            del self.freq[old_key]

        # A new book starts on the bottom shelf, by the chair.
        self.cache[key] = value
        self.freq[key] = 1
        self.buckets[1][key] = None
        self.minfreq = 1