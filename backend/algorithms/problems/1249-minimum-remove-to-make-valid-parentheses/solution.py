def minRemoveToMakeValid(s: str) -> str:
    stack, remove = [], set()
    for i, c in enumerate(s):
        if c == "(":
            stack.append(i)
        elif c == ")":
            if stack:
                stack.pop()
            else:
                remove.add(i)
    remove.update(stack)
    return "".join(c for i, c in enumerate(s) if i not in remove)
