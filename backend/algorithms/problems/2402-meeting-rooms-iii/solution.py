from heapq import heappush, heappop, heapify


def mostBooked(n: int, meetings: list[list[int]]) -> int:
    """
    Expressions:
        'max(range(n), key=count.__getitem__)' : `range(n)` :creates `indices 0…n-1`, then for each `index i`, calls `count.__getitem__(i)` (same as `count[i]`) to fetch the value; after comparing all, returns the `index i` whose `count[i]` is largest.
    """

    busy = []
    heapify((free := [*range(n)]))
    count = [0] * n

    for s, e in sorted(meetings):
        while busy and busy[0][0] <= s:
            _, r = heappop(busy)
            heappush(free, r)
        if free:
            r = heappop(free)
            heappush(busy, (e, r))
        else:
            next_end, r = heappop(busy)
            heappush(busy, (next_end + (e - s), r))
        count[r] += 1

    return max(range(n), key=count.__getitem__)
