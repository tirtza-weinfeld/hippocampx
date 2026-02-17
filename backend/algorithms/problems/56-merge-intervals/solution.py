def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort()
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= (end := merged[-1][1]):
            merged[-1][1] = max(end, e)
        else:
            merged.append([s, e])
    return merged
