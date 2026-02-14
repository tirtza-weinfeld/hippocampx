from collections import OrderedDict


class LRUCache:
    """
    Intuition:
        Deep Dive: OrderedDict = dict + doubly-linked list (kept in sync):
            Deep Dive: Structure:
                dict: `key ──► node`
                list: `HEAD ⇄ k1 ⇄ k2 ⇄ k3 ⇄ TAIL`
                    node = `(prev, next, key, value)`
            Deep Dive: Operations:
                `lookup od[k]`
                    **dict:** `key → node` → **node:** read `value` → $O(1)$
                `insert od[k] = v` *(k not present)*
                    **list:** link new node before `TAIL` → **dict:** store `k → node` → $O(1)$
                `update od[k] = v` *(k present)*
                    **dict:** lookup node → **node:** `value = v` → **list unchanged** → $O(1)$
                `delete del od[k]`
                    **dict:** remove `k` → **list:** unlink node → $O(1)$
            Deep Dive: Important behavior:
                Tracks **insertion order** (not usage order):
                    `od[k]` and `od[k] = v` do **not** relink nodes.
                Usage order (LRU) is a policy you add via:
                    `move_to_end(k)` (touch) and `popitem(last=False)` (evict LRU)
            *Key idea:*
                Order changes only by pointer splices; no rebuilding/shifting.

    Expressions:
        'cache.popitem':
            `cache.popitem()` removes last
            `cache.popitem(last=False)` removes first
        'cache.move_to_end':
            `cache.move_to_end(key)` move to right end
            `cache.move_to_end(key, last=False)`  move to front
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
