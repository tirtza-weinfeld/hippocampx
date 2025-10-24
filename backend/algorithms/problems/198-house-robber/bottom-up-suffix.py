def rob(houses: list[int]) -> int:
    """
    Expressions:
    'reversed(range(len(houses)))': for i in range(len(houses) - 1, -1, -1)
    """
    h1 = h2 = 0
    for i in reversed(range(len(houses))):
        h1, h2 = max(h1, houses[i] + h2), h1
    return h1
