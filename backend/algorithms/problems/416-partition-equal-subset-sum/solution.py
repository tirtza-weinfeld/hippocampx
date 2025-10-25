def canPartition(nums: list[int]) -> bool:
    """
    Intuition:
        This is the **0/1 Knapsack** decision problem in disguise:
        The problem transforms from partitioning an array into a simpler question: \
            can a subset of "items" (`nums`) perfectly fill a "knapsack" with capacity `total_sum // 2`? \
            Each item's weight is equal to its value.

    Time Complexity:
        O(n * target)

    Expressions:
          '(total := sum(nums)) & 1': odd sum
    """

    if (total := sum(nums)) & 1:
        return False

    nums.sort(reverse=True)
    if nums[0] > (target := total // 2):
        return False

    memo = {}

    def dp(i: int, r: int) -> bool:
        if r == 0:
            return True
        if r < 0 or i == len(nums):
            return False
        if (k := (i, r)) not in memo:
            memo[k] = dp(i + 1, r - nums[i]) or dp(i + 1, r)
        return memo[k]

    return dp(0, target)
