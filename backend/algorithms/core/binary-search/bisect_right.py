

def simple_bisect_right(a, x):
    """
    Title:
        Simple Bisect Right

    Intuition:
        Return the index where to insert item x in list a, assuming a is sorted.

    Expressions:
        'r = mid': If the x is less than the middle element, the insertion point could be `mid` or to its left. Shrink search space to the left half.
        'l = mid + 1': If the x is >= middle element, the insertion point must be to the right of `mid`.

    """

    l, r = 0, len(a)
    while l < r:
        mid = (l + r) // 2
        if x < a[mid]:
            r = mid
        else: 
            l = mid + 1 
    return l
