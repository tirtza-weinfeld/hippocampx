class Solution:
    def removeInvalidParentheses(self, s: str) -> list[str]:
        out = []                                              # collected valid strings (min deletions, no dups)

        def go(t: str, i0: int, j0: int, op: str, cp: str) -> None:
            """
            DFS that removes the minimum invalid parentheses for the current "pass".

            Args:
                t: Current candidate string after deletions so far.
                i0: Scan start index in `t` (everything before i0 is already known to be valid for this pass).
                j0: Deletion start index (only consider removing cp at positions >= j0 to avoid duplicates).
                op: Balance-increasing char for this pass (adds +1). First pass: '(' ; second pass: ')'.
                cp: Balance-decreasing char for this pass (adds -1). First pass: ')' ; second pass: '('.
            """
            bal = 0                                           # current prefix balance for this pass
            for i in range(i0, len(t)):                       # scan from the last safe scan position
                bal += (t[i] == op) - (t[i] == cp)            # +1 for op, -1 for cp, 0 for letters
                if bal >= 0:                                  # still valid prefix (no extra cp yet)
                    continue

                # First invalid prefix ends at i: too many `cp` in t[i0..i]
                for j in range(j0, i + 1):                    # try removing ONE cp within the invalid prefix
                    if t[j] == cp and (j == j0 or t[j - 1] != cp):
                        go(t[:j] + t[j + 1:], i, j, op, cp)   # remove t[j], then continue scan from i, allow removals from j
                return                                        # must fix this earliest invalid prefix before scanning further

            rt = t[::-1]                                      # no extra cp found → reverse to check the opposite side
            if op == "(":
                go(rt, 0, 0, ")", "(")                        # second pass removes extra '(' (as cp in reversed scan)
            else:
                out.append(rt)                                # both passes done → this is a valid minimal-removal result

        go(s, 0, 0, "(", ")")                                  # pass 1: remove extra ')'
        return out
