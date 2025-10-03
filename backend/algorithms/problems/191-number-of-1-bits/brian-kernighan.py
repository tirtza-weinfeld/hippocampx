
def hammingWeight(n: int) -> int:
    """
    Intuition:
        Brian Kernighan's algorithm:
        counts the number of set bits (1s) in an integer efficiently by \
            repeatedly clearing the lowest set bit until the number becomes 0.

        Deep Dive: Why this always works
        When you subtract 1 from a binary number:
	        You flip the lowest set bit (1) to 0
	        And everything to the right of it flips to 1

        Example: 
        Start
            ```python
                n = 13 (1101)
                count = 0
            ```
        Iteration 1
            ```python
                n   = 1101 (13)
                n-1 = 1100 (12)
                ---------------- &
                      1100 (12)
                count = 1
            ```    
        Iteration 2
            ```python
                n   = 1100 (12)
                n-1 = 1011 (11)
                ---------------- &
                      1000 (8)
                count = 2
            ```
        Iteration 3
            ```python
                n   = 1000 (8)
                n-1 = 0111 (7)
                ---------------- &
                      0000 (0)
                count = 3
            ```
    Time Complexity:
        O(k): 
        where k = number of 1s (faster than looping 32 times)  

    """
    count = 0
    while n:
        n &= n - 1 # drop the lowest set bit
        count += 1
    return count
    