class Solution:
    def minCost(self, costs: list[list[int]]) -> int:
        """
        Intuition:
            Deep Dive:Paint House (k=3) — Top-down DP with explicit memoization:
            **Subproblems:** dp(i, c) = min total cost to paint houses *[2!]suffix [i:]* given house i is painted color c
            **Relate:** *$dp(i, c) = costs[i][c] + \min_{c'!=c} dp(i+1, c')$*
            **Topological order:** *[2!]decreasing i*, subproblem `dp(i)` depends only on strictly larger i, `dp(i+1)`, so acyclic
            **Base case:** `dp(n) = [0, 0, 0]` (no houses left)
            **Original problem:** `answer = min(dp(0))`     

        Time complexity:
            O(n):
            number of subproblems is n (We compute dp(i) once for each i)
            time per subproblem is O(1) (k=3).
            → *Θ(n)* total
        

        Returns:
            Minimum total cost to paint all houses with no adjacent equal colors.
        """
        n, memo = len(costs), {}

        def dp(i: int) -> list[int]:
            """
            Expressions:
                'nxt = dp(i + 1)': dp(i+1) = costs from the suffix [i+1:]
            Variables:
                m1: smallest cost in nxt
                m2: second smallest cost in nxt
                c1: color of smallest cost in nxt (m1's color)
                nxt = costs for suffix [i+1:]
            """
            if i == n:
                return [0, 0, 0]  

            if i not in memo:
                nxt = dp(i + 1)  
                
                m1 = m2 = float("inf"); c1 = -1
                for c, v in enumerate(nxt):
                    if v < m1:
                        m2, m1, c1 = m1, v, c
                    elif v < m2:
                        m2 = v
                memo[i] = [costs[i][c] + (m2 if c == c1 else m1) for c in range(3)]
            return memo[i]

        return min(dp(0))