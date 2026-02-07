from collections import deque


class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        window_max: list[int] = []
        q = deque()  # holds indices, nums[q] is decreasing

        for i, num in enumerate(nums):
            # 1) drop indices that fell out of the window
            while q and q[0] <= i - k:
                q.popleft()

            # 2) maintain decreasing values in q
            while q and nums[q[-1]] <= num:
                q.pop()

            q.append(i)

            # 3) front is the max for this window
            if i >= k - 1:
                window_max.append(nums[q[0]])

        return window_max
