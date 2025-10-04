
import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    """
    Time Complexity:
        O(n log k):
        Deep Dive: one sift (faster constant) vs push+pop
            heappush does a sift-up → O(log k)
            heappop does a sift-down → O(log k)
            total ≈ 2 x O(log k) operations
            heapreplace does one sift operation, not two
            removes root, places new element, and does only one sift-down → O(log k)
            So same asymptotic complexity, but half the work, fewer comparisons and function calls → faster constant factor.
    Expressions:
      'heapreplace(h, x)': replaces root with x, performs one sift-down  \
        → O(log k) with ~½ the operations of heappush(sift-up)+heappop(sift-down) (≈ 2 × O(log k))
    """
    h = nums[:k]; heapq.heapify(h)
    for x in nums[k:]:
        if x > h[0]:
            heapq.heapreplace(h, x) 
    return h[0]
 