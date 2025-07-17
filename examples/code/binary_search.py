from bisect import bisect_left, bisect_right

def searchInsert(nums: list[int], target: int) -> int:
    return bisect_left(nums, target)
    

def simple_bisect_left(a:list[int], x:int):
    """Return the index where to insert item x in list a, assuming a is sorted.
    
    Expressions:
    - 'l = mid + 1': If the target `x` is greater than the middle element `a[mid]`, the insertion point must be to the right of `mid`.
    - 'r = mid': If the target `x` is less than or equal to `a[mid]`, then `mid` is a potential answer, so we search the left half including `mid`.
    
    """
    
    l, r = 0, len(a)
    while l < r:
        mid = (l + r) // 2
        if x > a[mid]:
            l = mid + 1
        else:
            r = mid
    return l


def simple_bisect_right(a, x):
    """Return the index where to insert item x in list a, assuming a is sorted.

    Expressions:
        - 'r = mid': If the x is less than the middle element, the insertion point could be `mid` or to its left. Shrink search space to the left half.
        - 'l = mid + 1': If the x is >= middle element, the insertion point must be to the right of `mid`.

    """

    l, r = 0, len(a)
    while l < r:
        mid = (l + r) // 2
        if x < a[mid]:
            r = mid
        else: 
            l = mid + 1 
    return l
    




def searchRange(nums: list[int], target: int) -> list[int]:
    start = bisect_left(nums, target)
    if start < len(nums) and nums[start] == target:
        return start, bisect_right(nums, target) - 1
    return -1, -1


def findMin(nums: list[int]) -> int:
    """
    Given a unique-element sorted array that has been rotated at an unknown pivot, find its minimum value.

    Expressions:
        - 'l = mid + 1' : the smallest is on the right
    """
        
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] < nums[r]:
            r = mid
        else:
            l = mid + 1 
    return nums[l]




def minEatingSpeed(piles: list[int], h: int) -> int:

        def hours(k):
            return sum((p + k - 1) // k for p in piles)

        l, r = 1, max(piles)

        while l < r:
            mid = (l + r) // 2
            if hours(mid) <= h:
                r = mid
            else:
                l = mid + 1
        return l


def shipWithinDays(weights: list[int], days: int) -> int:

    def can(cap: int) -> bool:
        d ,curr = 1, 0
        for w in weights:
            if curr + w <= cap:
                curr += w
            else:
                d += 1
                curr = w
        return d <= days
    

    l, r = max(weights), sum(weights)

    while l < r:
        mid = (l + r) // 2
        if can(mid):
            r = mid
        else:
            l = mid + 1
    return l