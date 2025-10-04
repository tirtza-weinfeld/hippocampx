def largestRectangleArea( heights: list[int]) -> int:
    """
    Intuition:
        We treat each bar as the smallest bar in a rectangle:
        To find its maximal rectangle, we must know:
	        The first smaller bar to its left
	        The first smaller bar to its right
        That defines the rectangle's width.

        Algorithm Logic
        1.	Sentinel (0) ensures all bars are processed (flush remaining stack).
        2.	Stack invariant: indices of bars in increasing height order.
        3.	For each bar:
            While current height h is less than top of stack, we found the right boundary for heights[top].
            Pop it, compute:
                ```python
                height = heights[popped]
                width = i - stack[-1] - 1
                area = height * width
                ```
        
        because stack[-1] is now the index of the previous smaller bar (left boundary).
        
        	4.	Push current index.
        	5.	Remove sentinel before returning.
        
        Correctness
        	Each bar is pushed and popped once ⇒ O(n)
        	Stack always maintains increasing heights ⇒ ensures correct left boundary
        	When popped, i is the first index to the right where height drops ⇒ correct right boundary
        	All rectangles are considered exactly once ⇒ max area found.
        
    Time Complexity:
        O(n):
        Each index is pushed once and popped once, so the total operations across the loop are linear.
        *[19!]The inner while doesn't make it O(n²) because every pop is matched to one push.*
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


print(largestRectangleArea([2,1,2]))