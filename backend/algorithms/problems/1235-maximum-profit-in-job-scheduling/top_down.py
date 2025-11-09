from bisect import bisect_left


def maximum_profit_in_job_scheduling(
    startTime: list[int], endTime: list[int], profit: list[int]
) -> int:
    """
    Expressions:
        'dp(i + 1)': Skip this job and move to the next one
        'bisect_left(jobs, e, key=lambda x: x[0]))': Find the index of the first job whose start time is greater than or equal to the end time `e` of this job
        'p + dp(': Take this job and move accordingly
        'sorted(zip(startTime, endTime, profit))': pack and sort by start so we can jump to the next non-overlapping job
    Variables:
        memo: memo[i] = max profit starting from job i

    Time complexity:
        O(n log n):
        Sorting the jobs → O(n log n)
        For each of the `n` jobs, the top-down DP does one binary search (`bisect_left`) → O(log n) per call.
        Each state is memoized once → total O(n log n).



    """

    jobs = sorted(zip(startTime, endTime, profit))
    memo = {}

    def dp(i: int) -> int:
        if i == len(jobs):  # max profit starting from job i
            return 0
        if i not in memo:
            _, e, p = jobs[i]
            memo[i] = max(dp(i + 1), p + dp(bisect_left(jobs, e, key=lambda x: x[0])))
        return memo[i]

    return dp(0)
