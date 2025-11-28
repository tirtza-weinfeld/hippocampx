from collections import deque

class ACNode:
    __slots__ = ("next", "fail", "out")
    def __init__(self):
        self.next = {}
        self.fail = None
        self.out = []       # store lengths

class Solution:
    def addBoldTag(self, s: str, words: list[str]) -> str:
        # ---- build trie ----
        root = ACNode()
        for w in words:
            cur = root
            for c in w:
                cur = cur.next.setdefault(c, ACNode())
            cur.out.append(len(w))

        # ---- build failure links ----
        q = deque()
        root.fail = root
        for c, nxt in root.next.items():
            nxt.fail = root
            q.append(nxt)

        while q:
            u = q.popleft()
            for c, v in u.next.items():
                f = u.fail
                while f is not root and c not in f.next:
                    f = f.fail
                v.fail = f.next.get(c, root)
                v.out += v.fail.out
                q.append(v)

        # ---- run automaton + collect intervals ----
        intervals = []
        cur = root
        for i, ch in enumerate(s):
            while cur is not root and ch not in cur.next:
                cur = cur.fail
            cur = cur.next.get(ch, root)
            for L in cur.out:
                intervals.append((i - L + 1, i))

        if not intervals:
            return s

        # ---- merge intervals ----
        intervals.sort()
        merged = []
        a, b = intervals[0]
        for x, y in intervals[1:]:
            if x <= b + 1:
                b = max(b, y)
            else:
                merged.append((a, b))
                a, b = x, y
        merged.append((a, b))

        # ---- build output ----
        out = []
        idx = 0
        for a, b in merged:
            out.append(s[idx:a])
            out.append("<b>")
            out.append(s[a:b+1])
            out.append("</b>")
            idx = b + 1
        out.append(s[idx:])
        return "".join(out)