def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    end, count = intervals[0][1], 0
    for s, e in intervals[1:]:
        count += s < end
        end = end if s < end else e
    return count