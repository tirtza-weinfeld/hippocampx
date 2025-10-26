class Solution:
    def mergeStones(self, stones: list[int], K: int) -> int:
        """
        Expressions:
            '(r - l) % (K - 1)' :
                - Each merge reduces the pile count by K - 1
                    - Start: **n** piles
                        - After 1 merge → **n - (K - 1)** piles
                        - After 2 merges → **n - 2(K - 1)** piles
                        - After 3 merges → **n - 3(K - 1)** piles
                        - …and so on, until (if possible) you reach 1 pile
                - So to reach 1 pile from `n`, we need:
                    - *n - x(K - 1) = 1*,
                    - *n - 1 = x (K - 1)* for some integer *x*.
                - Thus (n - 1) must be divisible by (K - 1)
                   - checked in code by `(n - 1) % (K - 1) == 0`
                   - If not, merging all piles into one is impossible.
           Time Complexity:
               O(n^3):
               There are **O(n²)** subproblems (`l, r` pairs)
               For each subproblem, the loop `[language="python"]for t in range(l, r, K - 1)`
                   tries up to **O(n / (K - 1))** split points.
                   Each operation inside is *O(1)* (thanks to *[2!]prefix sums*)
               So the time complexity is O(n^3 / (K - 1))

           Space Complexity:
               O(n²) for memoization

        """
        if ((n := len(stones)) - 1) % (K - 1):return -1

        prefix, memo = [0], {}
        for x in stones: prefix.append(prefix[-1] + x)
        cost = lambda l, r: 0 if (r - l) % (K - 1) else prefix[r + 1] - prefix[l]

        def dp(l, r):
            """
            **Subproblem `dp(l, r)`**
	         Minimum total cost to reduce *stones[l..r]* \
            to the smallest legally attainable pile count under *K-merges*, which is *1 + ((r - l) % (K - 1))*.
	        When do we add a merge cost? Only if `(r - l) % (K - 1) == 0` (segment can fully collapse to one pile), in which case we include `cost(l, r)`.
            Expressions:
                'range(l, r, K - 1)' : The loop `range(l, r, K - 1)` enforces valid split points \
                    so each merge step always combines exactly *K* piles.
                'default=0' : If `r - l < K - 1` (the range of split points `range(l, r, K - 1`) is empty), \
                    meaning there aren't enough piles to form a *K-merge* yet — so no merge is possible yet,\
                    so no merge occurs so the cost is *0*.
            """
            if (key := (l, r)) not in memo:
                memo[key] = min(
                    (dp(l, t) + dp(t + 1, r) + cost(l, r) for t in range(l, r, K - 1)),
                    default=0,
                )
            return memo[key]

        return dp(0, n - 1)
