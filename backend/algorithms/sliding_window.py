class SlidingWindow:

    def numSubarrayProductLessThanK(self, nums: list[int], k: int) -> int:

        if k <= 1:
            return 0

        product, left, count = 1, 0, 0

        for right, num in enumerate(nums):
            product *= num
            while product >= k:
                product //= nums[left]
                left += 1
            count += right - left + 1
        return count

    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Expressions:
         - 'l = max(mp[c] + 1, l)' : ensures that l does not move backward in cases where the last occurrence of s[r] was before l.
        """

        mp, l, max_length = {}, 0, 0

        for r, c in enumerate(s):
            if c in mp:
                l = max(mp[c] + 1, l)
            mp[c] = r
            max_length = max(max_length, r - l + 1)
        return max_length
