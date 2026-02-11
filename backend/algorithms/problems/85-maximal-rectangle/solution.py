class Solution:
    def maximalRectangle(self, matrix: list[list[str]]) -> int:
        """
        Intuition:

            We process the matrix row by row:
            At each row `r`, we pretend that row `r` is the bottom of a rectangle.
            We build a histogram:
               `heights[c]` = how many consecutive '1's are directly above (and including) cell (r, c).
            In other words: Starting at `(r, c)`, move upward. Count how many 1's you see before hitting a `0`.
            This tells us how tall a rectangle can be if its bottom edge is row `r`.

            Example:
                ```markdown
                    Matrix:
                        1 0 1 1
                        1 1 1 1
                        0 1 1 0
                    Row 0 → heights = [1, 0, 1, 1]
                    Row 1 → heights = [2, 1, 2, 2]
                    Row 2 → heights = [0, 2, 3, 0]
                ```

            Each row forms a histogram.
                We compute the largest rectangle in that histogram
                and take the maximum over all rows.

        Variables:
            stack: stores column indices with strictly increasing heights. Invariant: `heights[stack[0]] < heights[stack[1]] < ... < heights[stack[-1]]`

        Expressions:
            '(n + 1)': We iterate one extra step (n + 1), The extra step uses `height = 0`(sentinel) to flush the stack.
        """

        heights = [0] * (n := len(matrix[0]))  # histogram heights
        best = 0  # global maximum rectangle area

        for row in matrix:

            # --- Step 1: Update histogram ---
            for c, v in enumerate(row):
                heights[c] = heights[c] + 1 if v == "1" else 0 # If current cell is `1`, extend the column height. If it's `0`, height resets (rectangle can't pass through `0`).

            # --- Step 2: Largest Rectangle in Histogram (can use  [Largest Rectangle in Histogram](./84-largest-rectangle-in-histogram) for this) ---
            stack: list[int] = []
            for i in range(n + 1):
                cur = heights[i] if i < n else 0  # sentinel at the end
                while stack and heights[stack[-1]] > cur:# If current height is smaller,we must "close" rectangles that were waiting.
                    h = heights[stack.pop()]  # height of rectangle
                    left = stack[-1] if stack else -1  # After popping: left boundary  = stack[-1] (or -1 if empty)
                    width = i - left - 1 # Width is distance between boundaries  (right boundary = i - 1)
                    best = max(best, h * width)  # Area with height h spanning that width
                stack.append(i)# Push current index as potential left boundary

        return best
