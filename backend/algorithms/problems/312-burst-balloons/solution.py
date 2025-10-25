class Solution:
    def maxCoins(self, nums: list[int]) -> int:
        """
        Expressions:
            '[1, *nums, 1]': Pad the array with 1s at both ends to handle boundaries easily
        """
        
        nums = [1, *nums, 1] 
        memo = {}  

        def dp(i, j):
            """
            Returns the maximum coins obtainable by bursting all balloons 
            strictly between indices `i` and `j` (*i and j are NOT burst*).
            Assumes `nums[i]` and `nums[j]` are the boundary balloons (not burst yet)

            Expressions:
                'default=0' : Base case: no balloons between `i` and `j` (no K exists) → 0 coins ,(The generator will be empty when j <= i + 1, so max(..., default=0) handles it))
                'dp(i, k)':  Max coins from left part (i, k)
                'nums[i] * nums[k] * nums[j]': Coins obtained by bursting balloon `k` LAST \
                   in the open interval `(i, j)`. At this point, all other balloons between \
                   `i` and `j` have already been burst, so the immediate neighbors of `k` are \
                   the boundary balloons at `i` and `j`. 
                'dp(k, j)': *Maximum coins obtainable from right part:* bursting all balloons strictly between `k` and `j` \
                   (i.e., in the open interval `(k, j)`), with `k` and `j` acting as unburst boundaries.
                'for k in range(i + 1, j)': Try every k in (i, j) as the LAST balloon to burst in the current interval. Since k is burst last, its adjacent unburst balloons are exactly nums[i] and nums[j].
                'dp(0, len(nums) - 1)': Solve for the entire padded array: burst all original balloons between 0 and len(nums)-1
            """
            if (key:=(i, j)) not in memo:
                memo[key] = max(
                    (
                        dp(i, k) 
                        + nums[i] * nums[k] * nums[j]  
                        + dp(k, j) 
                        for k in range(i + 1, j)     
                    ),
                    default=0  
                )
            return memo[key]

        return dp(0, len(nums) - 1)