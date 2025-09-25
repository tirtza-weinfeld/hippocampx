from bisect import bisect_left, bisect_right

def find_first_and_last_position_of_element_in_sorted_array(nums: list[int], target: int) -> list[int]:

    start = bisect_left(nums, target)
    if start < len(nums) and nums[start] == target:
        return start, bisect_right(nums, target) - 1
    return -1, -1
