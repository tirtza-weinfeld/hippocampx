def trapping_rain_water(height: list[int]) -> int:
    """
    Time Complexity:
        O(n)
    """
    l = trapped = 0

    for r, h in enumerate(height):
        if h >= (wall := height[l]):
            for v in height[l:r]:
                trapped += wall - v
            l = r

    maxr = height[-1]
    for v in reversed(height[l:]):
        maxr = max(maxr, v)
        trapped += max(0, maxr - v)

    return trapped
