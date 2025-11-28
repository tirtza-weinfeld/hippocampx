def addBoldTag(s: str, words: list[str]) -> str:

    bold, end = [False] * (n := len(s)), 0
    for i in range(n):
        for w in words:
            if s.startswith(w, i):
                end = max(end, i + len(w))
        bold[i] = i < end

    out, i = [], 0
    while i < n:
        if not bold[i]:
            out.append(s[i]); i += 1
        else:
            out.append("<b>")
            while i < n and bold[i]:
                out.append(s[i]); i += 1
            out.append("</b>")
    return "".join(out)