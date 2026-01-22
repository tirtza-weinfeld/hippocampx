def longest_increasing_subsequence(nums: list[int]):
    """
    dp[i] = length of the LIS that starts at index i ()`[i:]`)
    Time Complexity:    
        O(n^2)
    """
    memo, n = {}, len(nums)

    def dp(i):
        if i not in memo:
            memo[i] = 1 + max(
                (dp(j) for j in range(i + 1, n) if nums[j] > nums[i]),
                default=0
            )
        return memo[i]

    return max(dp(i) for i in range(n))



