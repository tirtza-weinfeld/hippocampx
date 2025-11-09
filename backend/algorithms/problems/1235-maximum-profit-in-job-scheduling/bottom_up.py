from bisect import bisect_right

def maximum_profit_in_job_scheduling(
    startTime: list[int], endTime: list[int], profit: list[int]
) -> int:
    
    jobs = sorted(zip(startTime, endTime, profit), key=lambda x: x[1])# Sort jobs by end time to ensure optimal substructure (DP on end times)

    
    ends, dp = [0], [0] # ends[i] = end time of the i-th chosen job; dp[i] = max profit up to ends[i]

    for s, e, p in jobs:
        
        i = bisect_right(ends, s) - 1 #  Find the latest job that finishes before current start time
        take = dp[i] + p  # profit if we include this job

        
        if take > dp[-1]:# Only append if this job improves the total profit
            ends.append(e)
            dp.append(take)

   
    return dp[-1] # dp[-1] holds the maximum total profit