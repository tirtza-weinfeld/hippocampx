class Solution:
    def maxCoins(self, nums: list[int]) -> int:

        nums, memo = [1, *nums, 1], {}
        cost = lambda l, r, k: nums[l] * nums[k] * nums[r]

        def dp(l, r):
            if (key := (l, r)) not in memo:
                memo[key] = max(
                    (dp(l, k) + dp(k, r) + cost(l, r, k) for k in range(l + 1, r)),
                    default=0,
                )
            return memo[key]

        return dp(0, len(nums) - 1)
