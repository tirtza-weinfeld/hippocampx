def maximum_subarray(nums: list[int]) -> int:
    """
    Intuition:

        This is essentially *Kadane's Algorithm*:
            Kadane’s Algorithm is an $O(n)$ dynamic programming method for finding the maximum subarray sum in a list of integers (contiguous elements).
            Core idea:
                Keep track of the best sum ending at the current position
                If adding the current number hurts the sum, start fresh from the current number
                Track the overall maximum as you go


        Deep Dive: SRT BOT:
            Subproblem: `dp(i) = max(nums[i], nums[i] + dp(i-1))`
            Relate: `dp(i)` depends only on `dp(i-1)`   
            Topological order: increasing `i`
            Base case: `dp(0) = nums[0]`
            Original problem: `max(dp(i))` over all i
            Time complexity: O(n)
            Space complexity: O(1)
    Variables:
            curr_sum : the best subarray sum ending at the current index
            max_sum : the best subarray sum found so far
    Expressions:
            'curr_sum = max(num, curr_sum + num)': If extending the previous subarray lowers the sum (`num > curr_sum + num `), start a new subarray from the current element
         
    Args:
        nums: list of integers (can include negatives)

    Returns:
        int: Maximum subarray sum


    """
    max_sum = curr_sum = float("-inf")
    for num in nums:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum


