class Solution:
    def sortColors(self, nums: list[int]) -> None:
        cnt = [0, 0, 0]                          # frequency of 0, 1, 2

        for x in nums:
            cnt[x] += 1                          # first pass: count each color

        nums[:] = [                              # second pass: overwrite in-place
            c
            for c, f in enumerate(cnt)          # c = color, f = its frequency
            for _ in range(f)                   # repeat color f times
        ]                                       # keeps same list object
