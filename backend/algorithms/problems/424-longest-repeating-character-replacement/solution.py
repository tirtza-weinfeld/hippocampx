from collections import defaultdict


def characterReplacement(s: str, k: int) -> int:
    """
    Intuition:
    Sliding window with monotonic max_freq (can be stale).

    Example:    
        `s="BBBBAABAACADAACCCC"; k=3`
        max valid window: indices *4...13* *(len=10)*, `AABAACADAA`
        final `l=8` -> final window indices *8...17* *(len=10)*, invalid because `max_freq` \
            is stale; length is still correct since `r` only increases and `l` moves at most \
            once per `r`, so `r-l` never decreases.
    """
    counts = defaultdict(int)
    max_freq = l = 0
    for r, c in enumerate(s):
        counts[c] += 1
        max_freq = max(max_freq, counts[c])  # monotonic -> can be stale for current window
        if (r - l + 1) - max_freq > k: # the current window may be invalid even after the if-shrink; length (r-l+1) is still correctly the max valid window length(of some valid window), because window size never decreases.
            counts[s[l]] -= 1
            l += 1
    return len(s) - l # max_freq is monotonic (can be stale), so the final window may be invalid; we return len(s) - l because window size never decreases, so the final size, equals the maximum valid size seen earlier.


