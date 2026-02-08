class Solution:
    def findMedianSortedArrays(self, a: list[int], b: list[int]) -> float:
        """
        Intuition:
            Binary search for a partition in the smaller array such that the combined 
            left half's elements are all less than or equal to the combined right half's elements.
            The median is then derived from the boundary values of this partition.
        Time Complexity:    
            $O(log(min(m, n)))$
            Binary search is performed on the shorter array.    
        """
        if len(a) > len(b): a, b = b, a # Binary search on the shorter array for efficiency
        m, n, low, high = len(a), len(b), 0, len(a)

        while low <= high:
            i = (low + high) // 2       # Partition index for 'a'
            j = (m + n + 1) // 2 - i    # Partition index for 'b' (complements 'i')

            # Handle boundaries with infinity to avoid index errors
            al = a[i-1] if i > 0 else float('-inf') # Max element on a's left
            ar = a[i] if i < m else float('inf')    # Min element on a's right
            bl = b[j-1] if j > 0 else float('-inf') # Max element on b's left
            br = b[j] if j < n else float('inf')    # Min element on b's right

            if al <= br and bl <= ar: # Check if the combined partition is valid
                if (m + n) % 2: return float(max(al, bl)) # Odd: median is on the left
                return (max(al, bl) + min(ar, br)) / 2.0  # Even: average of the two middle values

            if al > br: high = i - 1 # 'a' contributes too much to the left; shift left
            else: low = i + 1        # 'a' contributes too little to the left; shift right
