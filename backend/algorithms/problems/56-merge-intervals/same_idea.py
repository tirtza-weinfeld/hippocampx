
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort()
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        if s > merged[-1][1]:
            merged.append([s, e])
        else:
            merged[-1][1] = max(merged[-1][1], e)
    return merged