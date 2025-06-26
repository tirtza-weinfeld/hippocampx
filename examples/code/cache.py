from collections import defaultdict, OrderedDict


class LRUCache:
    def __init__(self, capacity: int):
        self.cache: OrderedDict[int, int] = OrderedDict()
        self.capacity = capacity

    def get(self, key: int) -> int:
        if (val := self.cache.get(key)) is None:
            return -1
        self.cache.move_to_end(key)
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)



class LFUCache:
    def __init__(self, capacity: int):
        self.capacity    = capacity
        self.cache       = {}  # key → value
        self.freq        = {}  # key → freq
        # self.buckets: defaultdict[int, OrderedDict[int, None]]
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
        # increment and add to new bucket
        self.freq[key] +=1 # self.freq[key] = f + 1
        self.buckets[f + 1][key] = None

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self._bump(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if self.capacity <= 0:
            return

        if key in self.cache:
            self.cache[key] = value
            self._bump(key)
            return

        # evict if needed
        if len(self.cache) >= self.capacity:
            old_key, _ = self.buckets[self.minfreq].popitem(last=False)
            del self.cache[old_key]
            del self.freq[old_key]

        # insert new key at freq=1
        self.cache[key] = value
        self.freq[key] = 1
        self.buckets[1][key] = None
        self.minfreq = 1