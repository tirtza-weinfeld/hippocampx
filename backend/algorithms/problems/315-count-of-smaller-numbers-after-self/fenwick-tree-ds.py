class Solution:
    def countSmaller(self, nums: list[int]) -> list[int]:
        r"""
        Intuition:
        
            Coordinate Compression:
                map each value to its 1-based rank among sorted distinct values;
                example: `nums=[5,2,6,1,2]`, distinct sorted = `[1,2,5,6]` -> `ranks={1:1, 2:2, 5:3, 6:4}`.

            Sweep right → left:
                for each `nums[i]`, query how many already-inserted ranks are smaller, then insert `ranks[nums[i]]`.

            Fenwick Tree (Binary Indexed Tree):
                maintains prefix sums over a conceptual frequency array `freq`, where `freq[r]` = count of inserted elements with rank `r`.
                $$
                    \text{tree}[i] = \sum_{t = i - (i \& -i) + 1}^{i} \text{freq}[t]; \text{ block length} = i \& -i.
                $$

        Expressions:
            'sorted(set(nums))': sorted distinct values; example: `nums=[5,2,6,1,2]` -> `[1,2,5,6]`.
            'ranks = {v: i+1 for i, v in enumerate(sorted(set(nums)))}': 1-based rank map; example: `{1:1, 2:2, 5:3, 6:4}`.
            'r = ranks[nums[i]]': compressed rank of current value; example: `nums[i]=5` -> `r=3`.
            'query(r - 1)': prefix sum of `freq[1..r-1]`, i.e. count of inserted values with rank < r; example: after inserting `[2,2,6]`, `freq=[0,2,0,1]`, `query(2)=2`.
            'update(r)': increment `freq[r]` by 1 via Fenwick propagation; example: `update(3)` changes `freq=[0,2,0,1]` to `freq=[0,2,1,1]`.
            'i & -i': lowest set bit (LSB); example: `12 (1100₂) -> 4`, `6 (0110₂) -> 2`, `7 (0111₂) -> 1`.
            'i += i & -i': move to next ancestor during update; example: `i=3 -> 4 -> 8`.
            'i -= i & -i': strip LSB during query; example: `i=7 -> 6 -> 4 -> 0`.
            'tree = [0] * (len(ranks) + 1)': 1-indexed Fenwick array; index 0 unused.
            'tree[i] += 1': add 1 to block sum at index i during update propagation.

        Args:
            nums: input array; example: `nums=[5,2,6,1,2]`.

        Variables:
            ranks: compression map `value -> 1-based rank`; example: `{1:1, 2:2, 5:3, 6:4}`.
            i: index scanning right → left; processed suffix is `nums[i+1:]`.
            r: compressed rank of `nums[i]`; example: `nums[i]=6` -> `r=4`.
            freq: (conceptual) rank frequency array for `nums[i+1:]`; example: after `[2,2,6]` -> `freq=[0,2,0,1]`.
            tree: Fenwick array over `freq`; example: `freq=[0,2,0,1]` -> `tree=[0,0,2,0,3]`.
            res: result array; `res[i] = query(r - 1)`.
            s: prefix-sum accumulator in `query`.

        Time Complexity:
            O(n log n):
            n = len(nums); each `query`/`update` is O(log K), K = number of distinct values.

        """

        ranks = {v: i+1 for i, v in enumerate(sorted(set(nums)))}  # coordinate compression (1-based rank)
        tree = [0] * (len(ranks) + 1)  # Fenwick tree array (1-indexed)
        res = [0] * len(nums)

        def update(i):
            while i < len(tree):
                tree[i] += 1              # freq[i] += 1 (via Fenwick propagation)
                i += i & -i               # move to next block covering this index

        def query(i):
            s = 0
            while i > 0:
                s += tree[i]              # accumulate block sum
                i -= i & -i               # move to parent block
            return s

        for i in range(len(nums) - 1, -1, -1):  # traverse right → left
            r = ranks[nums[i]]                 # compressed rank of current value
            res[i] = query(r - 1)              # count strictly smaller values
            update(r)                          # insert current value

        return res
