def capacity_to_ship_packages_within_d_days(weights: list[int], days: int) -> int:
    """
    Intuition:
        Binary searching the answer space, (the ship's capacity)
        The range of possible capacities is from `max(weights)` to `sum(weights)`.
        The problem has a **monotonic property** ideal for binary search. The function `daysNeeded(capacity)` is monotonically non-increasing: as `capacity` grows, the days required can only decrease or stay the same.
        This creates a predictable `\[False, ..., False, True, ..., True\]` sequence for our condition, `daysNeeded(capacity) <= days`. The goal is to find the leftmost `True`, which represents the minimal valid capacity.
            If `daysNeeded(capacity) <= days` is `True`, then `capacity` is a potential answer, and we try for a better (smaller) one in the left half by setting `r = capacity`.
            If it is `False`, then `capacity` is too small, and we must search for a larger capacity in the right half by setting `l = capacity + 1`.
    """
    def days_needed(capacity: int) -> int:
        d, load = 1, 0
        for w in weights:
            if load + w <= capacity:
                load += w
            else:
                d += 1
                load = w
        return d
    

    l, r = max(weights), sum(weights)
    while l < r:
        capacity = (l + r) // 2
        if days_needed(capacity) <= days:
            r = capacity
        else:
            l = capacity + 1
    return l
