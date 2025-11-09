from bisect import bisect_left


def maximum_profit_in_job_scheduling(
    startTime: list[int], endTime: list[int], profit: list[int]
) -> int:

    jobs = sorted([x for x in zip(startTime, endTime, profit)], key=lambda x: x[0])
    starts = [s for s, _, _ in jobs]

    n, memo = len(startTime), {}
    nextIdx = [bisect_left(starts, jobs[i][1]) for i in range(n)]

    def dp(i):
        if i >= n:
            return 0
        if i not in memo:
            memo[i] = max(jobs[i][2] + dp(nextIdx[i]), dp(i + 1))
        return memo[i]

    return dp(0)
