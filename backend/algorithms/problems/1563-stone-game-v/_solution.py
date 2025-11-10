def stone_game_v(stoneValue: list[int]) -> int:
    """
    Time Comlexity:
        O(n^3)
    """

    pre = [s := 0] + [(s := s + v) for v in stoneValue]

    memo = {}

    def dp(i, j):

        if (i, j) not in memo:

            memo[(i, j)] = max(
                (
                    (
                        l + dp(i, k)
                        if (l := pre[k] - pre[i]) < (r := pre[j] - pre[k])
                        else r + dp(k, j) if l > r else l + max(dp(i, k), dp(k, j))
                    )
                    for k in range(i + 1, j)
                ),
                default=0,
            )

        return memo[(i, j)]

    return dp(0, len(stoneValue))
