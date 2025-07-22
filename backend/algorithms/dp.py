class DP:

    def minimumTotal(self, triangle: list[list[int]]) -> int:
        """
        Given a triangle (list of lists), find the minimum path sum from top to bottom.
        From index `i` in a row, you may move to index `i` or `i + 1` in the next row.

        Args:
            triangle: list of list of integers

        Returns:
            int: The minimum path sum of the triangle.
        Variables:
            - memo: a dictionary to store the minimum path sum for each cell

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
        if (total_sum := sum(nums)) % 2 != 0:
            return False
        subset_sum = total_sum // 2
        dp = [True] + [False] * (subset_sum)
        for num in nums:
            for j in reversed(range(num, subset_sum + 1)):
                dp[j] = dp[j] or dp[j - num]
        return dp[subset_sum]
    
def fib(n: int) -> int:
    """
    Given an integer `n`, return the `n`-th Fibonacci number.

    Args:
        n: the index of the Fibonacci number to return

    Returns:
        int: The `n`-th Fibonacci number.
    """
    def fib_helper(n: int) -> int:
        """
        Given an integer `n`, return the `n`-th Fibonacci number.

        Args:
            n: integer

        Returns:
            int: The `n`-th Fibonacci number.
        """
        if n == 1:
            return 1
        return n * fib_helper(n - 1)
    
    return fib_helper(n)
        