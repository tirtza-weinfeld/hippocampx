class StoneGameIII:

    def stoneGameIII(self, stoneValue: list[int]) -> str:

        memo, n = {}, len(stoneValue)

        def dp(i):
            if i >= n:
                return 0
            if i not in memo:
                memo[i] = max(
                    sum(stoneValue[i : i + k]) - dp(i + k) for k in range(1, 4)
                )
            return memo[i]

        return "Alice" if dp(0) > 0 else "Bob" if dp(0) < 0 else "Tie"
