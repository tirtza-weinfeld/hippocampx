class Stock:

    def maxProfit(self, prices: list[int]) -> int:
        cost, profit = float("inf"), 0
        for price in prices:
            cost = min(cost, price)
            profit = max(profit, price - cost)
        return profit
    

    def maxProfitII(self, prices: list[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
    

    def maxProfitIII_cost_profit_tracking(self, prices: list[int]) -> int:
        """
        Expressions:
            - 'p - t1_profit' : money you'd need now if earlier profit covered part of this buy
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
    


    def maxProfitIII_hold_sell_states(self, prices: list[int]) -> int:

        """
        Expressions:
        - 'hold1 = hold2 = float("-inf")' : money you'd have if holding first stock
        - 'sell1 = sell2 = 0' : money you'd have if not holding first stock
        - 'hold1 = max(hold1, -p)' : buy first stock
        - 'sell1 = max(sell1, hold1 + p)' : sell first stock
        - 'hold2 = max(hold2, sell1 - p)' : buy second stock
        - 'sell2 = max(sell2, hold2 + p)' : sell second stock
        """
        hold1 = hold2 = float("-inf")  
        sell1 = sell2 = 0             

        for p in prices:
            hold1 = max(hold1, -p)         
            sell1 = max(sell1, hold1 + p)  
            hold2 = max(hold2, sell1 - p)  
            sell2 = max(sell2, hold2 + p)  
        return sell2
    

    def maxProfitIV_dp(self, k: int, prices: list[int]) -> int:
        cost = [float("inf")] * (k + 1)
        profit = [0] * (k + 1)
        for p in prices:
            for t in range(1, k + 1):
                cost[t] = min(cost[t], p - profit[t - 1])
                profit[t] = max(profit[t], p - cost[t])
        return profit[k]

    def maxProfitIV_states(self, k: int, prices: list[int]) -> int:
        buy  = [float("-inf")] * (k + 1)
        sell = [0] * (k + 1)
        for p in prices:
            for t in range(1, k + 1):
                buy[t]  = max(buy[t],  sell[t - 1] - p)
                sell[t] = max(sell[t], buy[t] + p)
        return sell[k]