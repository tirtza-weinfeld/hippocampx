def sparse_matrix_multiplication(
    A: list[list[int]], B: list[list[int]]
) -> list[list[int]]:

    m, n = len(A), len(B[0])

    # For each row i of A, store the column indices k where A[i][k] != 0
    A_cols = [[k for k, v in enumerate(row) if v] for row in A]

    # For each row k of B, store the column indices j where B[k][j] != 0
    B_cols = [[j for j, v in enumerate(row) if v] for row in B]

    C = [[0] * n for _ in range(m)]

    for i, ks in enumerate(A_cols):
        for k in ks:
            for j in B_cols[k]:
                C[i][j] += A[i][k] * B[k][j]  # C[i][j] += A[i][k] * B[k][j]

    return C
