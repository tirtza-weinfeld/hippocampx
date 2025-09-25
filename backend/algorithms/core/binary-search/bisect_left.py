

def simple_bisect_left(a: list[int], x: int):
    """
    Title:
        Simple Bisect Left

    Intuition:
        Return the index where to insert item x in list a, assuming a is sorted.
    
    Expressions:
        'l = mid + 1': If the target `x` is greater than the middle element `a[mid]`, the insertion point must be to the right of `mid`.
        'r = mid': If the target `x` is less than or equal to `a[mid]`, then `mid` is a potential answer, so we search the left half including `mid`.

    """
    
    l, r = 0, len(a)
    while l < r:
        mid = (l + r) // 2
        if x > a[mid]:
            l = mid + 1
        else:
            r = mid
    return l
