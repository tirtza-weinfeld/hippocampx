def maximum_subarray(nums: list[int]) -> int:
    """
    Time Complexity:
        O(n)
        where n is the length of the array. We iterate through the array once.

    Args:
        nums: List of integers

    Returns:
        Maximum sum of any contiguous subarray
    """
    max_sum = curr_sum = float("-inf")
    for num in nums:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum
