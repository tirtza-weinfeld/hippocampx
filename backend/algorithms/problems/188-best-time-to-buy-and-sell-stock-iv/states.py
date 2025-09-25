       

def best_time_to_buy_and_sell_stock_IV(k: int, prices: list[int]) -> int:
    buy  = [float("-inf")] * (k + 1)
    sell = [0] * (k + 1)
    for p in prices:
        for t in range(1, k + 1):
            buy[t]  = max(buy[t],  sell[t - 1] - p)
            sell[t] = max(sell[t], buy[t] + p)
    return sell[k]