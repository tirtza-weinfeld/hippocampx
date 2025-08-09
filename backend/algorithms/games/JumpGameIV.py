from collections import defaultdict


class JumpGameIV:
    def minJumps(self, nums: list[int]) -> int:


        # If array has less than 2 elements, no jump is needed.
        if (n := len(nums)) < 2:
            return 0

        # Map each number to all its indices.
        indicies = defaultdict(list)
        for i, num in enumerate(nums):
            indicies[num].append(i)

        # Initialize bidirectional search: one from start, one from end.
        begin, end = {0}, {n - 1}
        seen = {0, n - 1}
        steps = 0

        # Expand the frontier until the searches meet.
        while begin:
            # If the two fronts overlap, we've found the shortest path.
            if begin & end:
                return steps

            # Always expand the smaller frontier.
            if len(begin) > len(end):
                begin, end = end, begin

            next_level = set()
            for i in begin:
                # Same-value jumps: check all indices with the same value.
                for j in indicies[nums[i]]:
                    if j in end:
                        return steps + 1
                    if j not in seen:
                        seen.add(j)
                        next_level.add(j)
                indicies[nums[i]].clear()  # Prevent reprocessing the same value
                
                # Neighboring indices: i - 1 and i + 1.
                for j in (i - 1, i + 1):
                    if j in end:
                        return steps + 1
                    if 0 <= j < n and j not in seen:
                        seen.add(j)
                        next_level.add(j)
            begin = next_level
            steps += 1

        return steps