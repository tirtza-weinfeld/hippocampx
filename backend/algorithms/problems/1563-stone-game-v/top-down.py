def stone_game_v(a: list[int]) -> int:
    n = len(a)
    memo: dict[tuple[int, int], int] = {}
    mx: dict[tuple[int, int], int] = {}
    built = [False] * n

    for i, v in enumerate(a):
        memo[(i, i)] = 0          # score on single stone
        mx[(i, i)] = v            # score+sum on single stone

    def build(j: int) -> None:
        if built[j]:
            return
        if j:
            build(j - 1)          # ensure smaller cols ready
        built[j] = True

        mid = j
        left = a[j]               # sum(i..j)
        right = 0

        for i in range(j - 1, -1, -1):
            left += a[i]

            # keep right as large as possible but ≤ half
            while mid >= i and (right + a[mid]) * 2 <= left:
                right += a[mid]
                mid -= 1

            best = 0
            if right * 2 == left and mid >= i:      # equal → can take better side
                best = mx[(i, mid)]
            if mid > i:                              # take left part
                best = max(best, mx[(i, mid - 1)])
            if mid < j:                              # take right part
                best = max(best, mx[(j, mid + 1)])

            memo[(i, j)] = best

            # forward mx: best+sum vs previous
            cur = best + left
            mx[(i, j)] = max(mx[(i, j - 1)], cur)
            # backward mx: j→i (needed for right picks above)
            mx[(j, i)] = max(mx.get((j, i + 1), 0), cur)

    def dp(i: int, j: int) -> int:
        if i >= j:
            return 0
        build(j)
        return memo[(i, j)]

    return dp(0, n - 1)