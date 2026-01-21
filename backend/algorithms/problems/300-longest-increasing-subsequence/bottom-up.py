def longest_increasing_subsequence(nums: list[int]) -> int:


    dp = [1] * (n:=len(nums))  # dp[i] = LIS length starting at i

    for i in reversed(range(n)):
        dp[i] = 1 + max(
                (dp[j] for j in range(i + 1, n) if nums[j] > nums[i]),
                default=0
            )

    return max(dp)
