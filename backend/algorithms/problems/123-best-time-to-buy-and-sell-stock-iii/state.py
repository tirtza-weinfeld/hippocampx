def best_time_to_buy_and_sell_stock_III(prices: list[int]) -> int:
    """
    Expressions:
        'hold1 = hold2 = float("-inf")' : money you'd have if holding first stock
        'sell1 = sell2 = 0' : money you'd have if not holding first stock
        'hold1 = max(hold1, -p)' : buy first stock
        'sell1 = max(sell1, hold1 + p)' : sell first stock
        'hold2 = max(hold2, sell1 - p)' : buy second stock
        'sell2 = max(sell2, hold2 + p)' : sell second stock

    Intuition:
        hold sell states
    """
    hold1 = hold2 = float("-inf")
    sell1 = sell2 = 0

    for p in prices:
        hold1 = max(hold1, -p)
        sell1 = max(sell1, hold1 + p)
        hold2 = max(hold2, sell1 - p)
        sell2 = max(sell2, hold2 + p)
    return sell2
