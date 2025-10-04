from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    frequencies = Counter(nums) 
    return [key for key, _ in sorted(frequencies.items(), key=lambda item: item[1], reverse=True)][:k]
    
