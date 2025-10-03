from collections import Counter, defaultdict

def minWindow(s: str, t: str) -> str:
    """
    Time Complexity:
        O(m + n)
    """
    t_count, have = Counter(t), defaultdict(int)
    letters_needed, min_idx, l = len(t_count), None, 0
    for r, c in enumerate(s):
        have[c] += 1
        if have[c] == t_count[c]:
            letters_needed -= 1
            while letters_needed == 0:
                if not min_idx or r - l + 1 < min_idx[1] - min_idx[0]:
                    min_idx = l, r + 1
                have[s[l]] -= 1
                if have[s[l]] < t_count[s[l]]:
                    letters_needed += 1
                l += 1
    return "" if min_idx == None else s[min_idx[0] : min_idx[1]]