def koko_eating_bananas(piles: list[int], h: int) -> int:
    """
    Intuition:
        Binary searching the answer space, (eating speed `k`):
        The range of possible speeds is from `1` to `max(piles)`
        The key property is that the problem is **monotonic** (if a speed `k` is fast enough, any speed greater than `k` will also be fast enough)
        This allows us to binary search for the *minimum* valid speed
        We test a mid speed (`k = (l + r) // 2`)
            If it's valid (`hours(k) <= h`), we try to find a smaller valid speed by searching the lower half (`r = k`) 
            If it's too slow, we must increase the speed by searching the upper half (`l = k + 1`)
        The loop converges on the smallest `k` that works 🍌

    Time Complexity:
        O(n log m):              
        n is the number of piles
        m is the maximum pile size

    Args:    
        piles: The banana piles
        h: The hour limit (constraint:`len(piles) <= h`)

    Variables:
        l: The left pointer of the binary search
        r: The right pointer of the binary search
        k: The mid pointer of the binary search

    
    Expressions:
        'max(piles)' : at this speed, each pile takes ≤ 1 hour → total = len(piles) ≤ h

    Returns:
        The minimum eating speed
    """

    def hours(k:int) -> int:
        """
        computes total hours needed at speed k
        """
        return sum((p + k - 1) // k for p in piles)
        # return sum(math.ceil(pile / k) for pile in piles)

    l, r = 1, max(piles)
    while l < r:
        k = (l + r) // 2
        if hours(k) <= h:
            r = k
        else:
            l = k + 1
    return l
