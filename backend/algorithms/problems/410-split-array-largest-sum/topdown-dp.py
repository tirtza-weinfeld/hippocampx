def splitArray(nums: list[int], k: int) -> int:
    """
    Time Complexity:
        $O(n^2 \\cdot k)$:
        There are $O(n \\cdot k)$ memo states $(i, \\text{cuts})$
        Each state tries $O(n)$ split points $j$, doing $O(1)$ work per $j$ (prefix diff + memoized dp)
        Prefix build is $O(n)$, dominated

    """
    prefix = [0]
    for x in nums:
        prefix.append(prefix[-1] + x)

    memo, n = {}, len(nums)

    def dp(i: int, cuts: int) -> int:
        if cuts == 0:
            return prefix[n] - prefix[i]

        if (i, cuts) not in memo:
            memo[i, cuts] = min(
                (
                    max(prefix[j] - prefix[i], dp(j, cuts - 1))
                    for j in range(i + 1, n - cuts + 1)
                ),
                default=float("inf"),
            )
        return memo[i, cuts]

    return dp(0, k - 1)
