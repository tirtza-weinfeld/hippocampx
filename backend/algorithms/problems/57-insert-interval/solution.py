def insert(intervals: list[list[int]], new: list[int]) -> list[list[int]]:
    res = []
    s, e = new
    i, n = 0, len(intervals)

    
    while i < n and intervals[i][1] < s: # 1) keep all before
        res.append(intervals[i])
        i += 1

    
    while i < n and intervals[i][0] <= e:# 2) merge overlaps
        s = min(s, intervals[i][0])
        e = max(e, intervals[i][1])
        i += 1
    res.append([s, e])

    
    res.extend(intervals[i:])# 3) append rest
    return res