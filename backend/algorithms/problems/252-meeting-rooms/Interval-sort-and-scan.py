def canAttendMeetings( intervals: list[list[int]]) -> bool:
        intervals.sort() # sorting by start times (`x[0]`) is more conventional when checking for sequential conflicts. but sorting by end times (`intervals.sort(key=lambda x: x[1])`) is correct as well        
        return all(intervals[i][0] >= intervals[i - 1][1] for i in range(1, len(intervals)))
    