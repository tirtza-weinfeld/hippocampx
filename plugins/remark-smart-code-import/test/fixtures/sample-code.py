from collections import defaultdict

def maxSubArrayLen(nums: list[int], k: int) -> int:
    """
    Find the maximum length of a subarray that sums to exactly k.
    LeetCode 325: Maximum Size Subarray Sum Equals k
    """
    sum_index = {0: -1}
    curr_sum = max_length = 0

    for i, num in enumerate(nums):
        curr_sum += num
        if (d := curr_sum - k) in sum_index:
            max_length = max(max_length, i - sum_index[d])
        if curr_sum not in sum_index:
            sum_index[curr_sum] = i

    return max_length


def subarraySum(nums: list[int], k: int) -> int:
    """
    Count the number of subarrays that sum to exactly k.
    """
    sum_freq = defaultdict(int, {0: 1})
    curr_sum = count = 0

    for num in nums:
        curr_sum += num
        count += sum_freq[curr_sum - k]
        sum_freq[curr_sum] += 1
    return count


class ExampleClass:
    def __init__(self):
        self.value = 42
    
    def get_value(self):
        return self.value 