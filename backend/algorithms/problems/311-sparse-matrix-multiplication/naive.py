def sparse_matrix_multiplication( mat1: list[list[int]], mat2: list[list[int]] ) -> list[list[int]]:

    m, k, n = len(mat1), len(mat1[0]), len(mat2[0])
    res = [[0] * n for _ in range(m)]

    for i in range(m):
        for j in range(n):
            for t in range(k):
                res[i][j] += mat1[i][t] * mat2[t][j]
    return res

