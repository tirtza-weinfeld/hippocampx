class Solution:
    def removeInvalidParentheses(self, s: str) -> list[str]:
        out = []                                              # collect all valid results with minimal removals

        def go(t, i0, j0, op, cp):
            bal = 0                                           # current balance: +1 for op, -1 for cp
            for i in range(i0, len(t)):                       # scan string from last known safe index
                bal += (t[i] == op) - (t[i] == cp)            # update balance at position i
                if bal >= 0:                                  # prefix is still valid so far
                    continue

                # bal < 0 → too many closing parentheses (cp) in prefix [i0 .. i]
                for j in range(j0, i + 1):                    # try removing one cp in the invalid prefix
                    if t[j] == cp and (j == j0 or t[j - 1] != cp):
                        go(                                   # recurse after removing this cp
                            t[:j] + t[j + 1:],               # string with one cp removed
                            i,                                # next scan starts at current i
                            j,                                # next removals start from j
                            op, cp                            # keep same direction
                        )
                return                                        # stop: must fix this first invalid prefix

            # finished scan with no extra cp in this direction
            rt = t[::-1]                                      # reverse string to check opposite imbalance
            if op == "(":
                go(rt, 0, 0, ")", "(")                        # second pass: remove extra '('
            else:
                out.append(rt)                                # both passes done → valid result

        go(s, 0, 0, "(", ")")                                  # first pass: remove extra ')'
        return out                                            # all valid strings with minimal deletions
