def can_partition_into_2_equal_subsets(nums: list[int]) -> bool:
    """
    Intuition:
        Paradigm: This is the **0/1 Knapsack** decision problem in disguise.

        Insight: The problem transforms from partitioning an array into a simpler question: can a subset of "items" (`nums`) perfectly fill a "knapsack" with capacity `total_sum / 2`? Each item's weight is equal to its value.

    Time Complexity:
        O(N * Sum):
        where N is the number of elements and Sum is the target subset sum.
    """
    memo, n = {}, len(nums)

    def dp(i, s):
        """
        Expressions:
          '(total := sum(nums)) & 1': odd sum
        """
        if i == n or s < 0:
            return False
        if s == 0:
            return True

        if (i, s) not in memo:
            memo[i, s] = dp(i + 1, s) or dp(i + 1, s - nums[i])

        return memo[(i, s)]

    return False if ((total := sum(nums)) & 1) else dp(0, total / 2)
