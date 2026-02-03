from math import isqrt


def numSquares(n: int) -> int:
    r"""
        
    Variables:
        dp: `dp[i]` = minimum number of perfect squares whose sum equals `i`
    
    Time Complexity:
        $O(n\sqrt{n})$:
        $\sum_{i=1}^{n} \sqrt{i} = O(n\sqrt{n})$

    """
    dp = [0] + [n] * n # '[n]': upper bound: n = 1^2 + 1^2 + ... + 1^
    for i in range(1, n + 1):
        dp[i] = min(dp[i - j*j] + 1 for j in range(1, isqrt(i) + 1)) # try all squares ≤ i, `isqrt(i)` returns `⌊√i⌋`
    return dp[n]
