def second_largest(nums: list[int]) -> int:
    """
    Given a list of unique positive integers, return the second largest integer
    """
    first = second = -1
    for num in nums:
        if num > first:
            second, first = first, num
        elif num > second:
            second = num
    return second


def second_largest(nums: list[int]) -> int | None:
    """
    Return the second largest distinct integer in nums.
    Works for any integers, including negatives and duplicates.
    Returns None if no such value exists.
    """
    first = second = float("-inf")
    for num in nums:
        if num > first:
            second, first = first, num
        elif first > num > second:
            second = num
    return second if second != float("-inf") else None
