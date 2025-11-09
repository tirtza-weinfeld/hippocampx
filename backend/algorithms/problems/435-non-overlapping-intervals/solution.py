def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    """
    Intuition:
        This greedy solution is correct because sorting by *[1!]end* time ensures each interval chosen leaves the most room for future ones
        Reasoning:
        	After sorting by *end* time, *end* tracks the boundary of the last non-overlapping interval.
        	    If the next start `s < end`, it *[1!]overlaps* → must remove one *[1!](increment count)*.
        	    Otherwise, update `end = e` *[3!](keep this interval).*
        This guarantees the maximum number of non-overlapping intervals remain — equivalently, minimum removals.

    Time Complexity:
        O(n log n):
            for the sorting

    """
    
    intervals.sort(key=lambda x: x[1]) # Sort intervals by their end time (earliest finishing first)
    end, count = intervals[0][1], 0  # `end` tracks last kept interval's end, `count` counts removals

    for s, e in intervals[1:]:
        if s < end:       # Overlaps with the previous interval → remove one
            count += 1
        else:              # No overlap → keep it and update `end`
            end = e
    return count           # Minimum number of intervals to remove
