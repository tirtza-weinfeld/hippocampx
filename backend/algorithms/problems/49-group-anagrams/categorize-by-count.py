from collections import defaultdict


def groupAnagrams(strs: list[str]) -> list[list[str]]:
    """
    Time complexity:
    $O(n \dot k)$:
    where $n$ is the number of strings and $k$ is the maximum length of a string
    (Iterates through each character once per string)
    """
    anagram = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord("a")] += 1
        anagram[tuple(count)].append(s)
    return list(anagram.values())
