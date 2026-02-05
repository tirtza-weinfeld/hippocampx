def dailyTemperatures( temperatures: list[int]) -> list[int]:
    stack, wait = [], [0] * len(temperatures)
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            wait[d] = i - (d:=stack.pop())
        stack.append(i)
    return wait
