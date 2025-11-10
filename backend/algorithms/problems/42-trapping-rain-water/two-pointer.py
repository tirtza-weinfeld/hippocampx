def trap(height: list[int]) -> int:
    """
    Intuition:
        Water trapped above each bar depends on the smaller of the tallest walls to its left and right:
        By keeping two pointers—one at each end—and always moving the smaller side inward, we ensure that the limiting wall for that side is already known.
            When the left bar is shorter, we can safely compute water at left using lmax (its tallest left wall), because a taller or equal wall must exist on the right.
            Symmetrically, when the right bar is shorter, we compute water using rmax.
        This invariant guarantees every position’s water level is computed exactly once in O(n) time and O(1) space

    Time Complexity:
        O(n)
      
    """
    l, r = 0, len(height) - 1
    lmax = rmax = water = 0

    while l < r:
        if (hl:=height[l]) < (hr:=height[r]):
            lmax = max(lmax, hl)
            water += lmax - hl
            l += 1
        else:
            rmax = max(rmax, hr)
            water += rmax - hr
            r -= 1
    return water
