
def minMeetingRooms(intervals: list[list[int]]) -> int:
    """
    Intuition:
    
        1. Sort all *start times* and all *end times*

        2. For each start time:
            if it is earlier than the earliest end time we haven't used yet, \
               no room has freed -> take a new room.
            otherwise, advance the end pointer -> reuse that freed room

        `rooms` becomes the maximum number of simultaneous meetings

    Time Complexity:
        O(n log n) for sorting
    """
    starts = sorted(s for s, _ in intervals)
    ends = sorted(e for _, e in intervals)
    rooms = e = 0
    for s in starts:
        if s < ends[e]:
            rooms += 1
        else:
            e += 1
    return rooms


  