def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Intuition:
        DFS with backtracking
        Sort candidates, try each starting from current index (to allow reuse), prune if number exceeds remaining target, and record the path when rem == 0.
    
    Time Complexity:
        O(2^n)
        Worst-case exponential in number of combinations explored, but pruning (if c > rem: break) reduces branches significantly.
    
    Args:
        candidates: List of candidate numbers
        target: Target sum to achieve
    
    Returns:
        List of all unique combinations that sum to target
    """

    candidates.sort()
    res, path = [], []

    def dfs(i: int, rem: int) -> None:
        if rem == 0:
            res.append(path.copy())
            return
        for j in range(i, len(candidates)):
            if (c := candidates[j]) > rem:
                break
            path.append(c)
            dfs(j, rem - c)
            path.pop()

    dfs(0, target)
    return res
