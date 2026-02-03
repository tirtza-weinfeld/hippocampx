class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        """
        Intuition:
            Problem Structure (Why a cycle exists):
                There are `n+1` indices with values in `{1,...,n}`. By the Pigeonhole Principle, at least one value repeats.
                Define `f(i) = nums[i]`. Each index has exactly one outgoing edge, forming a functional graph where a path eventually enters a cycle.
                The duplicate value is the cycle entrance (the only node with in-degree > 1).
    
            Deep Dive: Phase 1: Why slow and fast must meet:
                Let `λ` be the cycle length. Once both enter the cycle, we measure steps `k` relative to the entrance.
                slow moves 1 step per iteration, fast moves 2 steps.
                They meet iff their positions differ by a multiple of `λ`:
                    $2k ≡ k (mod λ)  =>  2k - k ≡ 0 (mod λ)  =>  k ≡ 0 (mod λ)$
                Since the relative gap closes by 1 each step, the smallest positive `k` satisfying this is `k = λ`. 
                Thus, they must meet within at most `λ` steps.
        
            Deep Dive: Phase 2: Why the meeting point leads to the duplicate:
                Let `μ` = distance from start to entrance, `λ` = cycle length, and `x` = distance from entrance to the meeting point.
                Total steps taken by slow at meeting: `t = μ + x`.
                From Phase 1, we know `t` must be a multiple of `λ`:
                    $t = kλ  =>  μ + x = kλ  =>  μ = kλ - x$
                This identity shows the distance from the start to the entrance (`μ`) is mathematically equal to the distance from the meeting point back to the entrance (`kλ - x`).
                If we reset one pointer to the start and move both at speed 1, they will collide exactly at the cycle entrance (the duplicate).
        
        Time Complexity: 
            $O(n)$
        
        Space Complexity:
            $O(1)$
        """
        slow = fast = 0
        while (slow := nums[slow]) != (fast := nums[nums[fast]]):
            pass  # phase 1: slow moves 1 step, fast 2 steps; guaranteed to meet inside cycle
        slow = 0  # reset slow to start; fast stays at meeting point
        while (slow := nums[slow]) != (fast := nums[fast]):
            pass  # phase 2: both move 1 step; they meet at cycle entrance
        return slow  # cycle entrance equals the duplicate value
