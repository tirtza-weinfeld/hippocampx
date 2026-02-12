class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        memo = {}
        def dp(i, j):
            if (i, j) not in memo:
                if j == len(p):
                    memo[i, j] = i == len(s)
                else:
                    ok = i < len(s) and p[j] in {s[i], "."}
                    if j + 1 < len(p) and p[j + 1] == "*":
                        memo[i, j] = ok and dp(i + 1, j) or dp(i, j + 2)
                    else:
                        memo[i, j] = ok and dp(i + 1, j + 1)

            return memo[i, j]

        return dp(0, 0)
