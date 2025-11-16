def spiral_matrix(matrix: list[list[int]]) -> list[int]:
    """
    Intuition:
        A spiral is formed by peeling the matrix layer by layer.
        Each layer has four edges:
            `→` top row  (left → right)
            `↓` right col (top → bottom)
            `←` bottom row (right → left)
            `↑` left col  (bottom → top)
        After traversing each edge, the boundaries (top, bottom, left, right) shrink inward. The process repeats until the boundaries cross\
        (Every cell is visited exactly once).

    Time Complexity:
        O(m x n):
            Every cell is visited exactly once.

    """
    res = []
    top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1  # current layer boundaries

    while top <= bottom and left <= right:  # stop when boundaries cross

        res += matrix[top][left : right + 1]      # `→` top row: left → right
        top += 1                                   # move boundary down

        for i in range(top, bottom + 1):           # `↓` right column: top `↓` bottom
            res.append(matrix[i][right])
        right -= 1                                  # move boundary left

        if top <= bottom:
            res += matrix[bottom][left : right + 1][::-1]  # `←` bottom row: right → left
            bottom -= 1                                     # move boundary up

        if left <= right:
            for i in range(bottom, top - 1, -1):    # `↑` left column: bottom `↑` top
                res.append(matrix[i][left])
            left += 1                                # move boundary right

    return res                                       # final spiral order