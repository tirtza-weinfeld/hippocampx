class Solution:
    def findPeakElement(self, nums: list[int]) -> int:
        l, r = 0, len(nums) - 1
        while l < r:
            m = (l + r) // 2
            if nums[m] < nums[m + 1]:   # uphill → peak on right
                l = m + 1
            else:                       # downhill or peak → left incl. m
                r = m
        return l
