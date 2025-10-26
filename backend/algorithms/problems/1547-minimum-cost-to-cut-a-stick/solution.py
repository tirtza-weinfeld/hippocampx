class Solution:
    def minCost(self, n: int, cuts: list[int]) -> int:
        cuts = [0, *sorted(cuts), n]
        memo = {}

        def dp(l: int, r: int) -> int:

            if (l, r) not in memo:
                memo[l, r] = min(
                    (
                        dp(l, k) + dp(k, r) + (cuts[r] - cuts[l])
                        for k in range(l + 1, r)
                    ),
                    default=0,
                )
            return memo[l, r]

        return dp(0, len(cuts) - 1)
