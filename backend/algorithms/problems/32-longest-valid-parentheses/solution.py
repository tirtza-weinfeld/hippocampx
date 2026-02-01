class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        Intuition:
        Use a stack of indices to mark positions that cannot be crossed by a valid parentheses substring
        Push indices of `(`
        When a `)` arrives, pop to match it;
            if the stack becomes empty, this `)` is unmatched and becomes the new base.
            Otherwise, the current valid length is the distance from the current index to the last unmatched position (`i - stack[-1]`)
                The maximum such distance is the answer.
        Variables:
            stack: `stack[i]` is an index that currently acts as a boundary (either an unmatched parenthesis or a base position) such that no valid parentheses substring can cross it.

        Expressions:
            'i - stack[-1])': distance from last unmatched position
        """
        stack = [-1]  # sentinel base: index before the string starts
        max_length = 0
        for i, c in enumerate(s):
            if c == "(":
                stack.append(i)  # store index of unmatched '('
            else:
                stack.pop()  # try to match this ')' with a '('
                if not stack:    # stack empty means we popped the base *(-1 or last unmatched `)`)*; this `)` has no matching `(`` before it, so it is itself unmatched
                    stack.append(i)  # record i as the new boundary for future valid substrings
                else:
                    max_length = max(max_length, i - stack[-1])
        return max_length
