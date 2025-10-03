def largestRectangleArea( heights: list[int]) -> int:
    """
    Time Complexity:
        O(n):
        Each index is pushed once and popped once, so the total operations across the loop are linear.
        The inner while doesn't make it O(n²) because every pop is matched to one push.
    Expressions:
        'heights.append(0)' : adds a **right sentinel** bar smaller than all others, forcing the stack to empty and compute all remaining areas at the end (no leftover bars).
        'stack = [-1]' : adds a **left sentinel** index before the array start, so width computation `i - stack[-1] - 1` always works (never empty stack).
        'heights[stack[-1]] > h' : pop while current bar is lower than stack's top
        'width = i - stack[-1] - 1' : We subtract 1 because the bar at stack[-1] is strictly smaller and marks the left boundary, which is excluded from the rectangle
        'heights.pop()' : restore original list
    """
    heights.append(0); stack  = [-1]; max_area = 0
    for i, h in enumerate(heights):
        while stack[-1] != -1 and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    heights.pop()
    return max_area

