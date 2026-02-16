from collections import defaultdict


def ladder_length(s: str, t: str, words: list[str]) -> int:
    """
    Intuition:
        Bidirectional BFS Meets in the Middle 🤝:
            View each word as a node; an edge exists if two words differ by one letter.
                The task is therefore the shortest path problem in an unweighted graph.
            Precompute wildcard patterns (e.g. `h*t`) mapping to all matching words:
                This allows immediate lookup of all valid one-step neighbors \
                instead of generating transformations dynamically.
            Run BFS simultaneously from `s`(source) and `t`(target):
                - The algorithm always expands the *smaller frontier* to reduce \
                the number of explored states. To achieve this, the roles of \
                `front` and `back` may swap during execution — they initially \
                represent source and target searches, but afterward simply \
                denote the smaller and larger frontier.
                - When a generated word has already been visited from the \
                opposite side, the two searches meet and the shortest \
                transformation length is determined.
            After a wildcard bucket is processed, it is cleared:
                so that the same adjacency list is not scanned again, \
                avoiding redundant work.

    Time Complexity:
        $O(N \cdot m)$:
        where $N$ is the number of words and $m$ is the word length.
        Building wildcard buckets costs $O(N \cdot m)$.
        The bidirectional BFS also totals $O(N \cdot m)$ since each \
        bucket is expanded once.

    Variables:
        buckets : map wildcard pattern → list of matching words (implicit adjacency)
        m       : word length
        front   : frontier currently being expanded (may swap sides)
        back    : opposite frontier
        seen_f  : visited nodes aligned with `front` (may flip)
        seen_b  : visited nodes aligned with `back`  (may flip)
        steps   : current transformation length (BFS depth)
    Expressions:
        'steps += 1': moving one BFS layer deeper
        'nxt = set()': next frontier to build    
    """
    if t not in words: return 0  # impossible to reach target if absent

    buckets, m = defaultdict(list), len(s)  # wildcard pattern → matching words, word length
    for w in words:                        # preprocess graph via intermediate patterns
        for i in range(m):
            buckets[w[:i] + "*" + w[i + 1 :]].append(w)  # e.g. h*t → ["hot","hit",...]

    front, back = {s}, {t}      # bidirectional frontiers (roles may swap)
    seen_f, seen_b = {s}, {t}   # visited sets aligned with front/back
    steps = 1                              # path length counting begin word

    while front and back:                  # continue while both searches alive
        if len(front) > len(back):         # always expand smaller frontier (optimization)
            front, back, seen_f, seen_b = back, front, seen_b, seen_f
        steps += 1; nxt = set()
        for u in front:                    # current vertex (word)
            for i in range(m):             # generate wildcard neighbors
                for v in buckets[(key := u[:i] + "*" + u[i + 1 :])]:  # neighbor vertex
                    if v in seen_b:        # searches meet → shortest path found
                        return steps
                    if v not in seen_f:    # unseen from this side
                        seen_f.add(v)      # mark visited
                        nxt.add(v)         # schedule for next layer
                buckets[key] = []          # clear bucket so adjacency scanned only once
        front = nxt                        # advance BFS frontier
    return 0                               # no connection found
