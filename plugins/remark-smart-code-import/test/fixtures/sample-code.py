"""Sample Python code for testing the remark-smart-code-import plugin."""

from collections import defaultdict

def maxSubArrayLen(nums: list[int], k: int) -> int:
    """Find the maximum length of a subarray that sums to k."""
    prefix_sum = {0: -1}
    current_sum = 0
    max_length = 0
    
    for i, num in enumerate(nums):
        current_sum += num
        if current_sum - k in prefix_sum:
            max_length = max(max_length, i - prefix_sum[current_sum - k])
        if current_sum not in prefix_sum:
            prefix_sum[current_sum] = i
    
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

class Calculator:
    """A simple calculator class for testing class extraction."""
    
    def __init__(self):
        self.history = []
    
    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def multiply(self, a: float, b: float) -> float:
        """Multiply two numbers."""
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def get_history(self) -> list[str]:
        """Get calculation history."""
        return self.history

class PrefixSumCalculator:
    """A calculator for prefix sum operations."""
    
    def __init__(self, nums: list[int]):
        self.nums = nums
        self.prefix_sum = self._build_prefix_sum()
    
    def _build_prefix_sum(self) -> list[int]:
        """Build prefix sum array."""
        prefix = [0] * (len(self.nums) + 1)
        for i in range(len(self.nums)):
            prefix[i + 1] = prefix[i] + self.nums[i]
        return prefix
    
    def range_sum(self, left: int, right: int) -> int:
        """Calculate sum of range [left, right]."""
        return self.prefix_sum[right + 1] - self.prefix_sum[left]

def another_function():
    """Another function to test function boundaries."""
    return "This is another function"

class NestedClass:
    """A class with nested methods for testing."""
    
    def __init__(self):
        self.value = 42
    
    def outer_method(self):
        """Outer method."""
        return self.value
    
    def inner_method(self):
        """Inner method."""
        return self.value * 2 