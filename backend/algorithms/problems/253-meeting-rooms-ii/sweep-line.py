from collections import defaultdict


def minMeetingRooms(intervals):
    """
    Intuition:
        Each start adds a room (+1), each end frees one (-1).
        Sweeping sorted times, track active meetings; the peak is the answer.

    Time Complexity:  
        O(n log n)
    """

    time = defaultdict(int)
    for s, e in intervals:
        time[s] += 1
        time[e] -= 1

    active = rooms = 0
    for _, d in sorted(time.items()):
        active += d
        rooms = max(active, rooms)
    return rooms
