from collections import defaultdict


def characterReplacement(s: str, k: int) -> int:
    counts = defaultdict(int)
    max_freq = l = 0
    for r, c in enumerate(s):
        counts[c] += 1
        max_freq = max(max_freq, counts[c])
        if (r - l + 1) - max_freq > k:
            counts[s[l]] -= 1
            l += 1
    return len(s) - l
