class Solution:
    def findMedianSortedArrays(self, a: list[int], b: list[int]) -> float:
        """
        Intuition:
            Binary-search how many elements to take from the smaller array:
            so that, together with the forced number from the other array,\
            they form a globally ordered left half whose boundary determines the median.

            We split each array at index `i` (for `a`) and `j` (for `b`):
            ```
            a:  a[:i] | a[i:]
            b:  b[:j] | b[j:]
            ```
            Now we only need the **largest value on the left** and the **smallest value on the right**:
                `al = a[i-1]` → last element of `a`’s left side
                    If `i == 0`, left side is empty → use `-∞`
                `ar = a[i]` → first element of `a`’s right side
                    If `i == m`, right side is empty → use `+∞`
                Same logic for `b`:
                    `bl = b[j-1]` → max of `b`’s left
                    `br = b[j]` → min of `b`’s right
                The infinities make comparisons like `al <= br and bl <= ar`  work even when one side is empty.

            
            Valid partition condition:
                boundaries are ordered -- `all left <= all right`
                `al <= br`  and  `bl <= ar`

            Once valid:
                If total is odd: `median = max(al, bl)`   (the last element of the left side)
                If total is even: `median = (max(al, bl) + min(ar, br)) / 2`
    

        Time Complexity:    
            $O(log(min(m, n)))$
            Binary search is performed on the shorter array.    
        """
        if len(a) > len(b): a, b = b, a # Binary search on the shorter array for efficiency, so i stays in [0..m]
        m, n, low, high = len(a), len(b), 0, len(a)

        while low <= high:
            i = (low + high) // 2        # i = how many elements from `a` go into the global left side
            j = (m + n + 1) // 2 - i     # j = remaining elements needed from `b` to make *global* left size exactly `half = (m+n+1)//2`

            # These four lines extract the **boundary values of the partition**, Use +/- infinity for empty sides of the partition (so boundary comparisons still work) .
            al = a[i-1] if i > 0 else float('-inf')  # a-left max (undefined if `i==0`)
            ar = a[i] if i < m else float('inf')     # a-right min (undefined if `i==m`)
            bl = b[j-1] if j > 0 else float('-inf')  # b-left max (undefined if `j==0`)
            br = b[j] if j < n else float('inf')     # b-right min (undefined if `j==n`)

            if al <= br and bl <= ar: # boundaries are ordered: `all left <= all right`
                if (m + n) % 2: return float(max(al, bl))  # odd: left side has the median
                return (max(al, bl) + min(ar, br)) / 2.0  # even: average of the two middles

            if al > br: high = i - 1 # took too many from a: a-left has something bigger than b-right; move cut left
            else: low = i + 1        # took too few from a: b-left has something bigger than a-right; move cut right
