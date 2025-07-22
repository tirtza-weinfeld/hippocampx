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




    def canPartitionTopDown(self, nums: list[int]) -> bool:

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

    def canPartitionBottomUp(self, nums: list[int]) -> bool:
        """
        Expressions:
            - 'if (total := sum(nums)) & 1':  # if the total is odd, you can’t split into two equal subsets
            - 'new_sums = {s + num for s in reachable if s + num <= target}': form new sums by adding current number to existing ones (but don’t exceed target)
            - 'reachable |= new_sums': update reachable sums
            - 'if target in reachable:': early exit if we’ve hit the target
            - 'return False': couldn’t reach the exact half-sum
        
        Variables:
            - target: the sum each subset needs to reach
            - reachable:  all subset-sums achievable so far

        """

        if (total := sum(nums)) & 1:
            return False
        
        target ,reachable = total / 2 ,{0} 

        for num in nums:
            new_sums = {s + num for s in reachable if s + num <= target}
            reachable |= new_sums
            if target in reachable:
                return True
        return False  
    