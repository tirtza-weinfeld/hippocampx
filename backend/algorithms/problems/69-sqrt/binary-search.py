def mySqrt(x: int) -> int:
    l, r = 0, x // 2
    while l <= r:
        m = (l + r) // 2
        if (p:=m * m) <= x < (m + 1) * (m + 1):
            return m
        (l, r) = (m + 1, r) if p < x else (l, m - 1)
    return l

