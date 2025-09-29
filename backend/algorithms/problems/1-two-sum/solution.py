def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Time Complexity:
        O(n)
        where n is the length of the nums array. We iterate through the array once.
    """

    seen = {}

    for i, num in enumerate(nums):
        if (x := target - num) in seen:
            return seen[x], i
        seen[num] = i
