class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        """
        Intuition:
            The goal is to place every number x at its 'natural' index (x - 1). 
            Since the first missing positive must fall within the range [1, n + 1], 
            we treat the input array as a makeshift hash map. By swapping numbers \
            into their correct positions in-place, we achieve O(n) time and O(1) space.
            Values outside [1, n] are ignored as they cannot be the first missing positive.

        Time Complexity:
        O(n)
        1. Phase 1 (Cyclic Sort):
            At first glance, the nested 'while' loop inside the 'for' loop might look like O(n^2). However, we use amortized analysis to show it is O(n).
            Each execution of the swap 'nums[i], nums[j] = nums[j], nums[i]' places at least one number into its final, correct position (where nums[i] == i + 1).
            Once a number is in its correct position, it is never moved again.
            Since there are at most n positions to fill, there can be at most n swaps in total across the entire execution of the program.
            Therefore, Phase 1 is O(n + n) = O(2n), which simplifies to O(n).
        2. Phase 2 (Inspection):
            We iterate through the array once to find the first index where the value doesn't match. This is a simple linear scan: O(n).    
        """

        # Phase 1: Cyclic Sort (The 'Seat Assignment')
        for i in range(n := len(nums)):                        # Walrus operator for length
            while 1 <= nums[i] <= n and nums[i] != nums[nums[i]-1]:
                # Swap current number with the one at its target destination
                j = nums[i] - 1                                # The 'correct' index for nums[i]
                nums[i], nums[j] = nums[j], nums[i]            # Pythonic in-place swap

        # Phase 2: Inspection (Finding the Gap)
        for i, val in enumerate(nums):                         # Scan sorted array
            if val != i + 1:                                   # If the 'seat' has the wrong number
                return i + 1                                   # This number is our first gap

        # If all positions are filled correctly, the answer is the next integer
        return n + 1                                           # Range was [1, n], so result is n+1
