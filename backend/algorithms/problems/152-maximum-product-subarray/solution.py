def maximum_product_subarray(nums: list[int]) -> int:

    hi = lo = max_prod = nums[0]
    for x in nums[1:]:
        if x < 0:
            hi, lo = lo, hi
        hi = max(x, hi * x)
        lo = min(x, lo * x)
        max_prod = max(max_prod, hi)
    return max_prod
