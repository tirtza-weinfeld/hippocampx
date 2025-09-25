def best_time_to_buy_and_sell_stock_III(prices: list[int]) -> int:
    """
    Intuition:
        Cost profit tracking
        Track the cost and profit for two separate trades, using the profit from the first trade to reduce the cost of the second trade.

    Time Complexity:
        O(n)
        where n is the length of the prices array. We iterate through the array once.

    Args:
        prices: List of stock prices

    Expressions:
        'p - t1_profit' : money you'd need now if earlier profit covered part of this buy

    Variables:
        t1_cost: cost of first trade
        t1_profit: profit of first trade
        t2_cost: cost of second trade
        t2_profit: profit of second trade

    Returns:
        Maximum profit from at most two transactions
    """

    t1_cost = t2_cost = float("inf")
    t1_profit = t2_profit = 0

    for p in prices:

        # First trade
        t1_cost = min(t1_cost, p) 
        t1_profit = max(t1_profit, p - t1_cost)

        # Second trade
        t2_cost = min(t2_cost, p - t1_profit)
        t2_profit = max(t2_profit, p - t2_cost)

    return t2_profit


