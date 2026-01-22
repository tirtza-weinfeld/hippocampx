from bisect import bisect_left


def longest_increasing_subsequence(nums: list[int]) -> int:
    """
    Intuition:
        `tails[k]` = smallest tail of any increasing subsequence of length `k+1`:
        We track the **best possible ending value** for each subsequence length(We don’t build the LIS itself).

        Example:
            ```text
            nums = [4, 10, 4, 3, 8, 9]
            4  → [4]
            10 → [4, 10]
            4  → [4, 10]   (replace, no growth)
            3  → [3, 10]   (better tail for length 1)
            8  → [3, 8]    (better tail for length 2)
            9  → [3, 8, 9] (extend)
            ```
            `[3, 8, 9]` is **not** a real subsequence, but its **length (3)** is the LIS length.
    
            **Why this works:**
            smaller tails give more room to extend later, and binary search keeps updates fast (**O(n log n)**).
    
    Time Complexity:
        O(nlogn)

    """
    tails: list[int] = []
    for x in nums:
        i = bisect_left(tails, x)  # strict increasing; use bisect_right for non-decreasing
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
