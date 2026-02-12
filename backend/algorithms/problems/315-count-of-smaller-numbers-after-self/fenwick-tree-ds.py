class Solution:
    def countSmaller(self, nums: list[int]) -> list[int]:
        """
        Intuition:
            Traverse right → left:
            Maintain a frequency structure of values already seen.
            For each number:
                `query(r - 1)` gives how many strictly smaller values exist
                `update(r)` inserts the current value
            Fenwick Tree idea:
                `tree[i]` stores the sum of a specific range of frequencies.
                The size of that range is determined by the lowest set bit of `i`.

            Deep dive:Bit trick:
                `i & -i` isolates the lowest set bit of i.
                Example:
                    ```
                    i = 12  -> 1100
                    -i      -> 0100 (two’s complement)
                    i & -i  -> 0100 (4)
                    ```
                That 4 means index 12 is responsible for a block of size 4.
                Moving:
                    `i += i & -i`   → jump to next block that includes this range
                    `i -= i & -i`   → move to parent block in prefix sum

        Time Complexity:
            O(n log n)
        """

        ranks = {v: i+1 for i, v in enumerate(sorted(set(nums)))}  # coordinate compression (1-based)
        tree = [0] * (len(ranks) + 1)  # Fenwick tree array (1-indexed)
        res = [0] * len(nums)

        def update(i):
            while i < len(tree):
                tree[i] += 1              # add 1 to this index's range
                i += i & -i               # jump to next index covering a larger block

        def query(i):
            s = 0
            while i > 0:
                s += tree[i]              # accumulate current block sum
                i -= i & -i               # move to parent block
            return s

        for i in range(len(nums) - 1, -1, -1):  # traverse right → left
            r = ranks[nums[i]]                 # compressed rank
            res[i] = query(r - 1)              # count smaller elements
            update(r)                          # insert current value

        return res
