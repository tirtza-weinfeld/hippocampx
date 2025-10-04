
def largestRectangleArea(heights: list[int]) -> int:
    """
    
    Intuition: 
    
        Each bar can form a rectangle where its height is the limiting factor:
        That rectangle extends until a strictly shorter bar appears on either side.
        Instead of searching both directions explicitly, we discover these bounds on the fly:
            when a shorter bar appears at `r`, every taller bar popped from the stack
            now knows its right boundary (`r`) and its left boundary (`l = stack.pop()`).
        
        Deep Dive: Walkthrough:
        Append `0` so every bar eventually meets a shorter right neighbor
        Keep *[3!]indices* in strictly increasing heights (stack starts *[3!][-1]*)
        For each `r, h`: while top is taller, pop `l` and compute area = `heights[l] * (r - stack[-1] - 1)`
        Push `r`; remove the sentinel; return best
    
    Time Complexity:
        O(n):
        Each index is pushed once and popped once, so the total operations across the loop are linear
        *[19!]It remains linear despite the inner while, because every pop is matched to one push*
    
    Expressions:
        'heights.append(0)' : adds a **right sentinel** bar smaller than all others, forcing the stack to empty and compute all remaining areas at the end (no leftover bars).
        'stack = [-1]' : adds a **left sentinel** index before the array start, so width computation `r - stack[-1] - 1` always works (never empty stack).
        'heights[stack[-1]] > h' : pop while current bar is lower than stack's top
        'width = r - stack[-1] - 1' : We subtract 1 because the bar at stack[-1] is strictly smaller and marks the left boundary, which is excluded from the rectangle
        'heights.pop()' : restore original list

    Variables:
        stack: indices with strictly increasing heights
    """
    heights.append(0)
    stack = [-1]; best = 0
    for r, h in enumerate(heights):
        while stack[-1] != -1 and heights[stack[-1]] > h:
            l = stack.pop()
            best = max(best, heights[l] * (r - stack[-1] - 1))
        stack.append(r)
    heights.pop()
    return best
