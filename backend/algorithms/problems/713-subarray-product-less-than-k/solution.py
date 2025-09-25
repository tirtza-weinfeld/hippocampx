def num_subarray_product_less_than_k(nums: list[int], k: int) -> int:
    """
    Time Complexity:
        O(n)
    """
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
