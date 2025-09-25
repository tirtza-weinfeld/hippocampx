from bisect import bisect_left

def search_insert_position(nums: list[int], target: int) -> int:
    """

    """
    return bisect_left(nums, target)
