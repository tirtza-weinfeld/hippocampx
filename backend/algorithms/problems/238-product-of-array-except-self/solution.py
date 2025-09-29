def product_of_array_except_self(nums: list[int]) -> list[int]:
    """
    Intuition:
        Two passes:
	    1.	*[orange!]Prefix* pass → `res[i]` = product of all elements *[orange!]before* `i`.
	    2.	*[purple!]Suffix* pass → multiply each `res[i]` by product of all elements *[purple!]after* `i`.

    Time Complexity:
        O(n)
        where n is the length of the nums array. We iterate through the array twice.

    """

    pre, res = 1, [1] * (n := len(nums))
    for i, x in enumerate(nums):
        res[i], pre = pre, pre * x
    suf = 1
    for i in range(n - 1, -1, -1):
        res[i], suf = res[i] * suf, suf * nums[i]
    return res
