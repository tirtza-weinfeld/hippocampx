class Solution:
    def mergeStones(self, stones: list[int], K: int) -> int:
        if ((n := len(stones)) - 1) % (K - 1):return -1

        prefix = [0]
        for x in stones: prefix.append(prefix[-1] + x)
        cost = lambda i, j: prefix[j + 1] - prefix[i]
        
        memo = {}

        def dp(i, j):
            if i == j:
                return 0
            if (key := (i, j)) not in memo:
                memo[key] = min(
                    dp(i, t) + dp(t + 1, j) + (cost(i, j) if (j - i) % (K - 1) == 0 else 0)
                    for t in range(i, j, K - 1)
                )
            return memo[key]

        return dp(0, n - 1)
