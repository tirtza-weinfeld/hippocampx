class Solution:
    def mergeStones(self, stones: list[int], K: int) -> int:
        # Check global feasibility: merging reduces pile count by (K - 1)
        # → must satisfy (n - 1) % (K - 1) == 0 to end up with exactly 1 pile
        if ((n := len(stones)) - 1) % (K - 1):
            return -1

        # Prefix sums for O(1) subarray cost calculation
        prefix = [0]
        for x in stones:
            prefix.append(prefix[-1] + x)

        # cost(l, r): total stones in range [l..r]
        # Add this cost only when the segment can fully merge into 1 pile
        cost = lambda l, r: prefix[r + 1] - prefix[l] if (r - l) % (K - 1) == 0 else 0

        memo = {}

        # dp(l, r): minimum total cost to merge stones[l..r]
        # into the smallest legally attainable pile count under K-merges
        # That number is 1 + ((r - l) % (K - 1));
        # if it equals 1, we include cost(l, r) since it can fully merge
        def dp(l, r):
            if (key := (l, r)) not in memo:
                memo[key] = min(
                    (dp(l, t) + dp(t + 1, r) + cost(l, r) for t in range(l, r, K - 1)),
                    default=0,  # if not enough piles to merge, cost = 0
                )
            return memo[key]

        return dp(0, n - 1)