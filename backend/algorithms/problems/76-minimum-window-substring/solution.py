from collections import Counter


def min_window(s: str, t: str) -> str:
    """
    Variables:
        deficit: `deficit[x]` = required count - window count
        missing: total characters still required
        best: best window as half-open [l, r)
    """
    deficit, missing = Counter(t), len(t)
    best, l = (0, len(s) + 1), 0

    for r, c in enumerate(s):         # expand window by moving right pointer
        missing -= deficit[c] > 0     # if c was still needed, satisfy one requirement
        deficit[c] -= 1               # include c in window (may become negative = surplus)

        while not missing:            # window currently satisfies all requirements
            if r - l + 1 < best[1] - best[0]:  # found smaller valid window
                best = (l, r + 1)     # store as half-open interval

            deficit[s[l]] += 1        # remove left char from window
            missing += deficit[s[l]] > 0  # if we now lack that char, window becomes invalid
            l += 1                    # shrink from the left

    return "" if best[1] > len(s) else s[best[0]:best[1]]  # return best substring or ""
