class Solution:
    def minCost(self, n: int, cuts: list[int]) -> int:

        cuts, memo = [0, *sorted(cuts), n], {}
        cost = lambda l, r: cuts[r] - cuts[l]

        def dp(l, r):
            if (l, r) not in memo:
                memo[l, r] = min(
                    (dp(l, k) + dp(k, r) + cost(l, r) for k in range(l + 1, r)),
                    default=0,
                )
            return memo[l, r]

        return dp(0, len(cuts) - 1)
