def new21Game(n: int, k: int, maxPts: int) -> float:
    r"""
    Intuition:
        Problem:
        Compute $P(\text{final total} \le n)$ given that you start at total 0, drawing uniformly from $\{1, \ldots, \text{maxPts}\}$, and stop when total $\ge k$.
        
        Subproblems:
        dp[x] = $P(\text{eventually end} \le n \mid \text{current total}=x)$

        Relation:
        If x < k we must draw again:
        dp[x] = $\frac{1}{\text{maxPts}} \sum_{d=1}^{\text{maxPts}} dp[x+d]$
        Pure average over next reachable states.

    Args:
        n: Count a win if final total ≤ n.
        k: Stopping threshold; drawing ends when total ≥ k.
        maxPts: Draws are integers in [1, maxPts].

    Returns:
        Probability of final score ≤ n.


    """
    if k == 0 or n >= k + maxPts:
        return 1.0

    memo = {}

    def dfs(t: int) -> float:
        if t in memo:
            return memo[t]

        if t >= k:
            return 1.0 if t <= n else 0.0

        s = 0.0
        for d in range(1, maxPts + 1):
            s += dfs(t + d)

        memo[t] = s / maxPts
        return memo[t]

    return dfs(0)