def diagonal_traverse(mat: list[list[int]]) -> list[int]:
    """
    Intuition:
        Each diagonal is defined by `r + c = d`.
        (note: always diagonal `r+c=d` ↗️ ,not anti-diagonal `[red!]r-c=d` ↙️)
        Even-indexed diagonals `( d % 2 == 0)` must be read up-right ↗️  ,
            so we start from the lowest valid `(r,c)`.
        Odd-indexed diagonals go down-left ↙️,
            so we start from the rightmost valid `(r,c)`.
        Each diagonal is traversed once in its direction, collecting every cell exactly once.
    Time Complexity:
        O(m x n):
            Every matrix cell is visited exactly once across all diagonals.
    """
    m, n = len(mat), len(mat[0])
    res = []
    for d in range(m + n - 1):                      # each diagonal is all (r,c) with r+c=d
        if d % 2 == 0:                              # even d → traverse up-right
            r = min(d, m - 1)                       # largest r allowed: `r≤m−1` (bottom) and `r≤d` (else `c=d−r<0`)
            c = d - r                               # c forced by r+c=d
            while r >= 0 and c < n:                 # valid while inside top/bottom + left/right
                res.append(mat[r][c])
                r -= 1                              # move up
                c += 1                              # move right
        else:                                        # odd d → traverse down-left
            c = min(d, n - 1)                       # largest c allowed: `c≤n−1` (right edge) and `c≤d` (else `r=d−c<0`)
            r = d - c                               # r forced by r+c=d
            while c >= 0 and r < m:                 # valid while inside bounds
                res.append(mat[r][c])
                r += 1                              # move down
                c -= 1                              # move left
    return res                                      # final zig-zag order
