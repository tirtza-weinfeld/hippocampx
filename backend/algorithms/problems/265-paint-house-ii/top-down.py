
class Solution:
    def minCostII(self, costs: list[list[int]]) -> int:
        """
        Intuition:
            Deep Dive: Paint House (k colors) — Top-down DP with explicit memoization
                Subproblems: dp(i, c) = min total cost to paint suffix houses [i:] given house i is color c
                Relate: *$dp(i,c) = {costs}[i][c] + \min_{c \!= c} dp(i+1,c')$*
                Topological order: decreasing i (each dp(i,·) depends only on dp(i+1,·)) ⇒ acyclic
                Base case: dp(n, c) = 0 for all c (no houses left)
                Original problem: answer = min(dp(0, c)) over all colors c

            Time complexity: 
                O(n * k):
                *n* rows x *O(k)* per row using *(m1, m2, c1)* trick

            Space: 
                Θ(n·k) for memo (stores a length-k row per i)
        """
        n, k, memo = len(costs), len(costs[0]) , {}

        def dp(i: int) -> list[int]:
            """
            Expressions:
                'costs[i][c] + (m2 if c == c1 else m1)' :If current color equals c1, we must take m2; otherwise take m1
                'for c, v in enumerate(nxt)' : Scan once to find the two best colors for the next row
            Variables:
                m1: smallest value in nxt
                m2: second smallest value in nxt
                c1: color of smallest cost in nxt (m1's color)
                nxt = costs for suffix [i+1:]

            """
            if i == n:
                return [0] * k

            if i not in memo:
                nxt = dp(i + 1)

                m1 = m2 = float("inf"); c1 = -1
                for c, v in enumerate(nxt):
                    if v < m1:
                        m2, m1, c1 = m1, v, c
                    elif v < m2:
                        m2 = v
                memo[i] = [costs[i][c] + (m2 if c == c1 else m1) for c in range(k)]
            return memo[i]

        return min(dp(0))