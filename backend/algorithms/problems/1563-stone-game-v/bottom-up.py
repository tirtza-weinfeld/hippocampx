def stone_game_v(a: list[int]) -> int:
    """
    Intuition:
        Split i..j into two parts; you can only keep the smaller-sum side,
        or either if equal. dp[i][j] = best score in a[i..j].
        mx[i][j] = best score + sum for a[i..j], to reuse quickly.

        Deep Dive:
        Each move divides the array into left and right parts. You can only continue with the side whose total sum is smaller; if equal, you may choose either. The goal is to maximize the total score gained from chosen parts.
        We iterate over all subarrays i..j, expanding outward and adjusting a pointer mid so that the right part stays as large as possible without exceeding half of the total. This ensures we check only balanced splits instead of every possible index.
        dp[i][j] stores the best score for i..j, while mx[i][j] caches the best “score + sum” prefix or suffix to quickly reuse.


    
    Time Complexity:
        O(n^2):
        Because each subarray `i..j` is processed once and the middle pointer `mid` moves **monotonically** (never resets for a fixed `j`), every index is advanced at most O(1) times per outer loop.
        Thus the total work is roughly proportional to the number of `(i, j)` pairs, giving **O(n²)** time and **O(n²)** space (for `dp` and `mx`).


    """
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    mx = [[0] * n for _ in range(n)]
    for i, v in enumerate(a):
        mx[i][i] = v  # sum of single element

    for j in range(1, n):
        mid = j
        left = a[j]
        right = 0
        for i in range(j - 1, -1, -1):
            left += a[i]

            # slide mid left so right part stays ≤ half of total
            while (right + a[mid]) * 2 <= left:
                right += a[mid]
                mid -= 1

            best = 0
            if right * 2 == left:              # equal → can pick better side
                best = mx[i][mid]
            if mid != i:                        # pick left side
                best = max(best, mx[i][mid - 1])
            if mid != j:                        # pick right side
                best = max(best, mx[j][mid + 1])

            dp[i][j] = best
            mx[i][j] = max(mx[i][j - 1], best + left)         # forward cache
            mx[j][i] = max(mx[j][i + 1], best + left)         # backward cache

    return dp[0][n - 1]