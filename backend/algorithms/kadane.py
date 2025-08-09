from bisect import bisect_left, insort

class Kadane:

    def maxSubArray(self, nums: list[int]) -> int:
        max_sum = curr_sum = float("-inf")
        for num in nums:
            curr_sum = max(num, curr_sum + num)
            max_sum = max(max_sum, curr_sum)
        return max_sum

    def maxProduct(self, nums: list[int]) -> int:
        
        hi = lo = max_prod = nums[0]
        for x in nums[1:]:
            if x < 0:
                hi, lo = lo, hi
            hi = max(x, hi * x)
            lo = min(x, lo * x)
            max_prod = max(max_prod, hi)
        return max_prod
    

    def maxSubarraySumCircular(self, nums: list[int]) -> int:
        total, max_end = min_end = 0
        max_sum, min_sum = float("-inf"), float("inf")
        for x in nums:
            total += x
            max_end = max(x, max_end + x)
            max_sum = max(max_sum, max_end)  # Kadane (max)
            min_end = min(x, min_end + x)
            min_sum = min(min_sum, min_end)  # Kadane (min)
        return max_sum if max_sum < 0 else max(max_sum, total - min_sum)





    def maxSumSubmatrix(self, mat: list[list[int]], k: int) -> int:
        
        # [Opt Loop Ordering] transpose so outer loops iterate the smaller dim (fewer (l,r) pairs)
        m, n = len(mat), len(mat[0])
        if m > n:
            mat = [list(r) for r in zip(*mat)]; m, n = n, m
    
        # [Kadane Fast-Path] classic Kadane; return value if ≤ k, else None → fall back to constrained step
        def kadane_leq(arr: list[int], K: int) -> int | None:
            best = cur = arr[0]
            for x in arr[1:]:
                cur = x if cur < 0 else cur + x   # Kadane “extend or restart”
                best = max(best, cur)
                if best == K: return K            # [Early Exit] cannot beat K
            return best if best <= K else None
    
        ans = float("-inf")
    
        # ------------------- Technique 1: Column-Pair Compression (2D → 1D) -------------------
        # Fix left/right columns; accumulate row sums inside this strip → a 1D array `row`.
        # Any contiguous subarray of `row` == some rectangle between columns [l..r].
        for l in range(n):
            row = [0] * m
            for r in range(l, n):
                for i in range(m): row[i] += mat[i][r]
    
                # Example: if mat = [[1,2,3],[4,5,6],[7,8,9]], (l,r)=(0,1) → row=[1+2,4+5,7+8]=[3,9,15]
    
                # ------------------- Technique 2: Kadane (fast path, unconstrained) -------------------
                fast = kadane_leq(row, k)
                if fast is not None:
                    ans = max(ans, fast)
                    if ans == k: return k   # [Early Exit]
                    continue
    
                # ------------------- Technique 3: Ordered Prefix Sums + Binary Search -------------------
                # 1D target: max subarray sum ≤ k on `row` with negatives allowed.
                # Keep sorted prefix sums; for running sum s, find smallest prefix p ≥ s-k → s - p ≤ k and as large as possible.
                # Example: row=[3,-2,5], k=6:
                # pref=[0]; s=3→need ≥ -3→pick 0→cand=3; s=1→≥ -5→0→cand=1; s=6→≥ 0→0→cand=6 (best)
                s, pref = 0, [0]
                for v in row:
                    s += v
                    j = bisect_left(pref, s - k)  # find smallest prefix ≥ s-k
                    if j < len(pref):
                        ans = max(ans, s - pref[j])
                        if ans == k: return k     # [Early Exit]
                    insort(pref, s)               # keep prefixes sorted for future queries
    
        return ans
