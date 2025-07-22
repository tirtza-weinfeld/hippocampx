class DP:

    def minimumTotal(self, triangle: list[list[int]]) -> int:
        """
        Given a triangle (list of lists), find the minimum path sum from top to bottom.
        From index `i` in a row, you may move to index `i` or `i + 1` in the next row.

        Expressions:
            - 'r == n - 1': bottom row
        """

        n, memo = len(triangle), {}

        def dp(r, c):
            if r == n - 1:
                return triangle[r][c]
            if (r, c) not in memo:
                memo[(r, c)] = triangle[r][c] + min(dp(r + 1, c), dp(r + 1, c + 1))
            return memo[(r, c)]

        return dp(0, 0)

    def canPartition(self, nums: list[int]) -> bool:

        memo, n = {}, len(nums)

        def dp(i, s):
            """
            Expressions:
                - '(total := sum(nums)) & 1': odd sum
            """
            if i == n or s < 0:
                return False
            if s == 0:
                return True

            if (i, s) not in memo:
                memo[i, s] = dp(i + 1, s) or dp(i + 1, s - nums[i])

            return memo[(i, s)]

        return False if ((total := sum(nums)) & 1) else dp(0, total / 2)

    def change(self, amount: int, coins: list[int]) -> int:

        memo, n = {}, len(coins)

        def dp(c, amount):
            if amount == 0:
                return 1
            if amount < 0 or c == n:
                return 0
            if (c, amount) not in memo:
                memo[c, amount] = dp(c, amount - coins[c]) + dp(c + 1, amount)
            return memo[c, amount]

        return dp(0, amount)

    def winnerSquareGame(self, n: int) -> bool:

        memo = {0: False}

        def dp(n):
            if n not in memo:
                memo[n] = any(not dp(n - i**2) for i in range(int(n**0.5), 0, -1))
            return memo[n]

        return dp(n)
    

    def mostPoints(self, questions: list[list[int]]) -> int:

        memo, n = {}, len(questions)

        def dp(i):
            if i >= n:
                return 0

            if i not in memo:
                memo[i] = max(dp(i + 1), (q:=questions[i])[0] + dp(i + 1 + q[1]))
            return memo[i]

        return dp(0)    
