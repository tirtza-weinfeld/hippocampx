

# from collections import defaultdict

# from code.cache import LRUCache


# def maxSubArrayLen(nums: list[int], k: int) -> int:
#     """
#     # 1
#     Find the maximum length of a subarray that sums to exactly k.
#     LeetCode 325: Maximum Size Subarray Sum Equals k
#     https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/
#     Args:
#         nums: List of integers.
#         k: Target sum.
#     Returns:
#         The length of the longest subarray with sum == k.
#     """

#     sum_index = {0: -1}  # odometer reading(cumulative distance) → earliest day index
#     curr_sum = max_length = 0

#     for i, num in enumerate(nums):
#         curr_sum += num  # update odometer reading (current cumulative distance)

#         # if we've seen (curr_sum - k) on day d,
#         # then days d+1…i cover exactly k km
#         if (d := curr_sum - k) in sum_index:
#             max_length = max(max_length, i - sum_index[d])

#         # record the first time we hit this odometer reading(this cumulative distance)
#         if curr_sum not in sum_index:
#             sum_index[curr_sum] = i

#     return max_length


# def subarraySum(nums: list[int], k: int) -> int:
#     """
#     # 2
#     Count the number of subarrays that sum to exactly k.
#     LeetCode 560: Subarray Sum Equals K
#     https://leetcode.com/problems/subarray-sum-equals-k/

#     Args:
#         nums: List of integers.
#         k: Target sum.
#     Returns:
#         The count of subarrays with sum == k.
#     """

#     sum_freq = defaultdict(int, {0: 1})
#     curr_sum = count = 0

#     for num in nums:
#         curr_sum += num
#         count += sum_freq[curr_sum - k]
#         sum_freq[curr_sum] += 1
#     return count


# def findMaxLength(nums: list[int]) -> int:
#     """
#     # 3
#     Find the maximum length of a contiguous subarray with equal number of positive and negative (or 1 and -1) values.
#     LeetCode 525: Contiguous Array
#     https://leetcode.com/problems/contiguous-array/

#     Args:
#         nums: List of integers (positive for forward, negative for backtrack).
#     Returns:
#         The length of the longest balanced subarray.
#     """
#     nums = [1 if num > 0 else -1 for num in nums]
#     return maxSubArrayLen(nums, 0)


# def checkSubarraySum(nums: list[int], k: int) -> bool:
#     """
#     # 4
#     Check if the array contains a subarray of at least length 2 whose sum is a multiple of k.
#     LeetCode 523: Continuous Subarray Sum
#     https://leetcode.com/problems/continuous-subarray-sum/

#     Args:
#         nums: List of integers.
#         k: The divisor.
#     Returns:
#         True if such a subarray exists, False otherwise.
#     """

#     mod_index = {0: -1}
#     prefix_mod = 0
#     for i, num in enumerate(nums):
#         prefix_mod = (prefix_mod + num) % k
#         # same remainder at day d and i ⇒ days d+1…i total ≡0 (mod k)
#         if prefix_mod in mod_index:
#             # ensures that the size of subarray is at least 2
#             if i - mod_index[prefix_mod] > 1:
#                 return True
#         else:
#             mod_index[prefix_mod] = i
#     return False


# def subarraysDivByK(nums: list[int], k: int) -> int:
#     """
#     # 5
#     Count the number of subarrays whose sum is divisible by k.
#     LeetCode 974: Subarray Sums Divisible by K
#     https://leetcode.com/problems/subarray-sums-divisible-by-k/

#     Args:
#         nums: List of integers.
#         k: The divisor.
#     Returns:
#         The count of subarrays with sum divisible by k.
#     """
#     mod_freq = defaultdict(int, {0: 1})
#     curr_mod = count = 0

#     for num in nums:
#         curr_mod = (curr_mod + num) % k
#         count += mod_freq[curr_mod]
#         mod_freq[curr_mod] += 1
#     return count


# def minSubarray(nums: list[int], k: int) -> int:
#     """
#     # 6
#     Find the length of the shortest subarray to remove so that the sum of the remaining elements is divisible by k.
#     LeetCode 1590: Make Sum Divisible by P
#     https://leetcode.com/problems/make-sum-divisible-by-p/

#     Args:
#         nums: List of integers.
#         k: The divisor.
#     Returns:
#         The length of the shortest subarray to remove, or -1 if not possible.
#     """
#     total_mod = sum(nums) % k
#     if total_mod == 0:
#         return 0
#     mod_index = {0: -1}
#     curr_mod, min_len = 0, len(nums)
#     for i, num in enumerate(nums):
#         curr_mod = (curr_mod + num) % k
#         need = (curr_mod - total_mod + k) % k
#         if need in mod_index:
#             min_len = min(min_len, i - mod_index[need])
#         mod_index[curr_mod] = i
#     return min_len if min_len < len(nums) else -1


# def getModifiedArray(updates: list[list[int]]) -> list[int]:
#     """
#     # 7
#     Apply a list of range updates to an array and return the modified array.
#     LeetCode 370: Range Addition
#     https://leetcode.com/problems/range-addition/

#     Args:
#         updates: List of [start, end, delta] updates.
#     Returns:
#         The modified array after all updates.
#     """
#     n = len(updates)
#     delta = [0] * (n + 1)  # n=len(nums)
#     for s, e, d in updates:
#         delta[s] += d
#         delta[e + 1] -= d

#     prefix = 0
#     return [(prefix := prefix + delta[i]) for i in range(n)]


# def numberOfArrays(differences: list[int], lower: int, upper: int) -> int:
#     """
#     # 8
#     Count the number of valid starting values for a hidden sequence given the differences and bounds.
#     LeetCode 2145: Count the Hidden Sequences
#     https://leetcode.com/problems/count-the-hidden-sequences/

#     Args:
#         differences: List of daily changes.
#         lower: Lower bound for the sequence.
#         upper: Upper bound for the sequence.
#     Returns:
#         The number of valid starting values.
#     """
#     prefix = min_s = max_s = 0
#     for d in differences:  # differences = nums
#         prefix += d
#         min_s = min(min_s, prefix)
#         max_s = max(max_s, prefix)
#     return max(0, (upper - max_s) - (lower - min_s) + 1)


