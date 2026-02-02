from collections import defaultdict


def groupAnagrams(strs: list[str]) -> list[list[str]]:
    """
    Time complexity:
    $O(n \dot k\log k)$:
    Sorting each string takes $(k \log k)$ time

    """
    anagram = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        anagram[key].append(s)
    return list(anagram.values())
