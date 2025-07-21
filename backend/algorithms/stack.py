class Solution:
    def decodeString(self, s: str) -> str:
        stack, s = [], "1[" + s + "]"
        for c in s:
            if c == "]":
                curr = []
                while stack[-1] != "[":
                    curr.append(stack.pop())
                stack.pop()  # remove "["
                num = []
                while stack and stack[-1].isdigit():
                    num.append(stack.pop())
                stack.append("".join(reversed(curr)) * int("".join(reversed(num))))
            else:
                stack.append(c)
        return stack[0]