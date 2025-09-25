def permutations(nums: list[int]) -> list[list[int]]:
    """
    Intuition:
        Recursive Tree of Choices
        Build permutations by choosing unused elements: At each level, try each remaining number, recurse with updated path, and backtrack to un-choose. Use used list or boolean flags to track chosen elements.

    Time Complexity:
        O(N!)
        N levels of recursion, each level explores N - depth options, total N! permutations.
        
    Space Complexity:
        O(N)
        Recursion depth is N, and we store the current permutation path.
    
    Args:
        nums: List of integers to permute
    
    Returns:
        List of all possible permutations
    """

    result, n = [], len(nums)

    def dfs(i):

        if i == n:
            result.append(nums[:])
        else:
            for j in range(i, n):
                nums[i], nums[j] = nums[j], nums[i]
                dfs(i + 1)
                nums[j], nums[i] = nums[i], nums[j]

    dfs(0)
    return result
