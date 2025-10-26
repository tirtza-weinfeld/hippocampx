class Solution:
    def maxCoins(self, nums: list[int]) -> int:
       
        nums = [1, *nums, 1]
        memo = {}

        def dp(l, r):
          
            if (key := (l, r)) not in memo:
                memo[key] = max(
                    (
                        dp(l, k) + dp(k, r) + nums[l] * nums[k] * nums[r]
                        for k in range(l + 1, r)),
                    default=0,
                )
            return memo[key]

        return dp(0, len(nums) - 1)
