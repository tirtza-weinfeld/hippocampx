def largestRectangleArea(heights: list[int]) -> int:
    """
    Intuition:
        Think of the stack as a “to-be-extended skyline”:
            Each index on the stack is a bar that is still waiting to learn where it must stop.\
            As we sweep with pointer `r`:
                If the new bar `h` is taller/equal, it can keep extending the skyline → push `r`.
                If the new bar `h` is shorter, it acts like a wall at position `r`:
                    every bar taller than `h` must stop just before this wall (at `r - 1`),\
                    so we pop those bars and finalize their best rectangles.
            The key picture:
                ```markdown
                    stack[-1]   ...   l   ...   r
                   (shorter)        (height)   (shorter)
                    ^ left wall                ^ right wall
                    Rectangle of height heights[l] spans between the walls, excluding them.
                ```
      
    Time Complexity:
        $O(n)$:
        Each index is pushed once and popped once, so total work is linear.

    Expressions:
        'heights.append(0)' : adds a right sentinel bar smaller than all others, forcing a final flush.
        'stack = [-1]' : left sentinel so width computation `r - stack[-1] - 1` always works.
        'heights[stack[-1]] > h' : current bar `h` is the wall that stops taller bars.
        'r - stack[-1] - 1' : number of consecutive bars that are at least `heights[l]` tall.
        'heights.pop()' : restore original list.
        'stack[-1]': index of the nearest strictly shorter bar to the left of `l` (the left wall)


    Variables:
        r: current index (the “wall” position when it is shorter)
        h: heights[r]
        l: popped index whose maximal rectangle is finalized now
        best: maximum rectangle area found
    """
    heights.append(0) # Append `0` so every bar eventually meets a shorter right neighbor (forces all pops).
    stack = [-1]; best = 0
    for r, h in enumerate(heights):
        while stack[-1] != -1 and heights[stack[-1]] > h:
            best = max(best, heights[stack.pop()] * (r - stack[-1] - 1))
        stack.append(r)
    heights.pop() # Remove the sentinel bar
    return best
