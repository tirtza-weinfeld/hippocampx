def sparse_matrix_multiplication(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:

    m, n = len(A), len(B[0])
    C = [[0] * n for _ in range(m)] # Output matrix m x n
    
    A_rows = [[(c, v) for c, v in enumerate(row) if v] for row in A] # For each row of A, keep only (c, v) where (v:=A[r][c]) != 0
    B_rows = [[(c, v) for c, v in enumerate(row) if v] for row in B] # For each row of B, keep only (c, v) where (v:=B[r][c]) != 0

    for i, row in enumerate(A_rows): # For each nonzero A[i][k] and each nonzero B[k][j], accumulate A[i][k] * B[k][j]
        for k, a in row:
            for j, b in B_rows[k]:
                C[i][j] += a * b # C[i][j]+=A[i][k]⋅B[k][j]

    return C
