class Solution:
    def removeInvalidParentheses(self, s: str) -> list[str]:
        """
        Intuition:
            We only delete a parenthesis when it is provably invalid, and we delete it at the earliest point where invalidity appears.
                Scan left → right counting balance.
                The first time balance goes negative, we know there are too many closing parentheses before this point.
                To fix this with minimum deletions, we must delete one ) from this prefix — try each distinct option and recurse.
                Never delete earlier than needed, and never delete the same parenthesis twice → guarantees minimal and duplicate-free results.
                After fixing extra ), reverse the string and repeat the same logic to fix extra (.
                If both passes succeed, the string is valid.
            This works because any valid string must be balanced in both directions, and the first invalid prefix fully determines where a deletion must occur.

        """
        out = [] # collect all valid results with minimal removals
        def go(t, i0, j0, op, cp):
            """
            DFS that removes the minimum invalid parentheses for the current "pass".
            Args:
                t: Current candidate string after deletions so far.
                i0: Scan start index in `t` (everything before i0 is already known to be valid for this pass).
                j0: Deletion start index (only consider removing `cp` at `positions >= j0` to avoid duplicates).
                op: Balance-increasing char for this pass (adds +1). First pass: `(` ; second pass: `)`.
                cp: Balance-decreasing char for this pass (adds -1). First pass: `)` ; second pass: `(`.
            """
            bal = 0 # current balance: +1 for `op`, -1 for `cp`
            for i in range(i0, len(t)): # scan string from last known safe index
                bal += (t[i] == op) - (t[i] == cp) # update balance at position i
                if bal >= 0:   # prefix is still valid so far
                    continue


                for j in range(j0, i + 1): # bal < 0 → too many closing parentheses (cp) in prefix `[i0 .. i]`.try removing one `cp` in the invalid prefix
                    if t[j] == cp and (j == j0 or t[j - 1] != cp):
                        go(                                   # recurse after removing this `cp`
                            t[:j] + t[j + 1:],               # string with one `cp` removed
                            i,                                # next scan starts at current `i`
                            j,                                # next removals start from `j`
                            op, cp                            # keep same direction
                        )
                return

            # finished scan with no extra cp in this direction
            rt = t[::-1] # reverse string to check opposite imbalance
            if op == "(": go(rt, 0, 0, ")", "(") # second pass: remove extra `(`
            else: out.append(rt) # both passes done → valid result
        go(s, 0, 0, "(", ")") # first pass: remove extra `)`
        return out # all valid strings with minimal deletions
