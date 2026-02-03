def findDuplicate(nums: list[int]) -> int:
    """
    Intuition:
        Finds the duplicate in $O(N)$ time and $O(1)$ space using 
        Floyd's Cycle-Finding Algorithm.
        [The Hare and Tortoise Algorithm](/notes/hare-and-tortoise-algorithm)
    """
    slow = fast = 0
    # Phase 1: Meet inside the cycle
    while (slow := nums[slow]) != (fast := nums[nums[fast]]):
        pass
    # Phase 2: Find the cycle entrance (the duplicate)
    slow = 0
    while (slow := nums[slow]) != (fast := nums[fast]):
        pass
    return slow
