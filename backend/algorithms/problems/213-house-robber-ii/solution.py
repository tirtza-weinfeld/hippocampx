def circularRob(houses: list[int]) -> int:
    """
    Intuition:
        In a circle, first and last houses are adjacent — we cannot rob both
        ⇒ Split into two linear cases:
            exclude last house → `rob(houses[:-1])`
            exclude first house → `rob(houses[1:])`
        Take the better of the two.

        Base case:
            if only one house, rob it directly.
    """
    if len(houses) == 1:
        return houses[0]
    # compute two linear cases and choose max
    return max(rob(houses[:-1]), rob(houses[1:]))

# 198
def rob(houses: list[int]) -> int:
    h1, h2 = 0, 0
    for h in houses:
        h2, h1 = h1, max(h1, h2 + h)
    return h1
