class Solution:
    def findPeakElement(self, nums: list[int]) -> int:
        """
        Intuition:
        Treat the array as a landscape. 
            If `nums[m] < nums[m+1]`, you are going uphill, so a peak must exist to the right. 
            If `nums[m] > nums[m+1]`, you are going downhill (or already at a peak), so a peak exists at m or to the left.
        
        Each comparison lets us discard half the array while preserving at least one guaranteed peak (since the ends are -∞). 
        Repeating this converges to a peak index in O(log n).
        """
        l, r = 0, len(nums) - 1
        while l < r:
            m = (l + r) // 2
            if nums[m] < nums[m + 1]:   # uphill → peak on right
                l = m + 1
            else:                       # downhill or peak → left incl. m
                r = m
        return l
