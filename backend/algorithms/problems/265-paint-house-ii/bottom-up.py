def minCostII(costs: list[list[int]]) -> int:
    n, k = len(costs), len(costs[0]); row = [0]*k
    for i in range(n-1, -1, -1):
        m1 = m2 = float('inf'); c1 = -1
        for c, v in enumerate(row):
            if v < m1: m2, m1, c1 = m1, v, c
            elif v < m2: m2 = v
        row = [costs[i][c] + (m2 if c == c1 else m1) for c in range(k)]
    return min(row)