
def generateParenthesis(n: int) -> list[str]:

    def gen(s: str, o: int, c: int):
        if o == c == n:
            yield s; return
        if o < n: yield from gen(s + "(", o + 1, c)  # delegate yields from the recursive generator (`yield from` is Python syntax for delegating to another generator)
        if c < o: yield from gen(s + ")", o, c + 1)  # same: stream all results from that branch
    return list(gen("", 0, 0))
