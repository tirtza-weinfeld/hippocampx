def three_sum(a: list[int]) -> list[list[int]]:
    """
    Intuition:
        Sort the array and use two pointers to find the triplets:
            After sorting, each value `a[i]` becomes a fixed anchor
            We then need a pair `(l, r)` such that:
                `a[i] + a[l] + a[r] == 0`
            Because the array is sorted
                increasing `l` raises the sum 
                decreasing `r` lowers it
            This turns the inner search into a classic two-pointer sweep

        Duplicate handling:
            Skip repeated anchors `i`.
            After finding one valid triplet, advance `l` past duplicates, because those pairs cannot form new distinct triplets.

    Time Complexity:
        O(n ^ 2):
	    The outer loop runs `n` times, and for each anchor `i` the `(l, r)` pointers move at most `n` total steps, because each pointer only moves forward/backward and never resets → O(n²) overall.


    Returns:
        All unique triplets `[x, y, z]` with `x + y + z = 0`.
    """

    a.sort()                     # O(n log n)
    out: list[list[int]] = []

    for i, x in enumerate(a):
        if i and x == a[i - 1]: continue  # skip duplicate anchors
        l, r = i + 1, len(a) - 1
        while l < r:
            s = x + a[l] + a[r]
            if s < 0: l += 1          # need a larger sum → move left pointer right
            elif s > 0: r -= 1          # need a smaller sum → move right pointer left
            else:
                out.append([x, a[l], a[r]])
                l += 1 ; r -= 1
                while l < r and a[l] == a[l - 1]: # skip duplicate second elements to avoid repeated triplets
                    l += 1
    return out