from collections import Counter, defaultdict


def groupAnagrams(strs: list[str]) -> list[list[str]]:
    """
    Slower than [categorize by count above](#categorize-by-count-solution). High constant overhead from creating multiple objects (Counter, then items(), then frozenset) per string.


    Time complexity:
    $O(n\dot k)$
    where $n$ is the number of strings and $k$ is the maximum length of a string
    """
    anagram = defaultdict(list)
    for s in strs:
        count = frozenset(Counter(s).items())
        anagram[count].append(s)
    return list(anagram.values())
