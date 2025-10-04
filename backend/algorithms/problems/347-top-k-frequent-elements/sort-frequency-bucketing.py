from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    """
    Time Complexity:
        O(n):
    	Counter(nums) → O(n)
    	Build buckets → O(n) (each element placed once)
    	Flatten in reverse until k → O(n)
    """
    
    bucket=[[] for _ in range(len(nums)+1)]
    for n,f in Counter(nums).items():
        bucket[f].append(n)
        
    return [num for f_bucket in reversed(bucket) for num in f_bucket][:k]
        

  