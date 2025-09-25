def best_time_to_buy_and_sell_stock(prices: list[int]) -> int:
    """
    Time Complexity:
        O(n)
        where n is the length of the prices array. We iterate through the array once.

    Args:
        prices: List of stock prices

    Returns:
        Maximum profit from buying and selling stock
    """
    cost, profit = float("inf"), 0
    for price in prices:
        cost = min(cost, price)
        profit = max(profit, price - cost)
    return profit
