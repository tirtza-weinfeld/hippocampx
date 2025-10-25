
def longestCommonSubsequence(a: str, b: str) -> int:
    if len(a) < len(b):  # keep b the shorter to save space
        a, b = b, a
    dp = [0] * (len(b) + 1)
    for ca in a:
        diag = 0
        for j, cb in enumerate(b, 1):
            diag, dp[j] = dp[j], (diag + 1 if ca == cb else max(dp[j], dp[j - 1]))
    return dp[-1]