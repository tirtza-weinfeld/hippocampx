from collections import defaultdict

def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
    time, count = defaultdict(int), 0
    for s, e in intervals:
        time[s] += 1
        time[e] -= 1
    for _, v in sorted(time.items()):
        count += v
        if count > 1:
            return False
    return True
