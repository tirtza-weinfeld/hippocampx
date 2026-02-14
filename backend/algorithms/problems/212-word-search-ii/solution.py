def word_search_II(board: list[list[str]], words: list[str]) -> list[str]:
    r"""
    Intuition:
        Build a trie of all words, then DFS the grid while synchronizing with the trie:
            The trie restricts DFS to only paths that match some word prefix.Instead of exploring all board paths, we explore only *possible* dictionary continuations.
            Found words are removed(`res.append(node.pop("$"))`), and empty trie branches are pruned(`f not node: parent.pop(c)` ), so the search space continuously shrinks.

    Time Complexity:
        $O(mn \cdot 3^{L})$
        where $m = \text{len(board)}$, $n = \text{len(board[0])}$, and $L = \max(\text{len(word)})$.
        Build trie: $O\!\left(\sum |word|\right)$.
        DFS search: Up to $mn$ starting cells. Branching ≤ $4$ initially and ≤ $3$ afterward (cannot revisit the previous cell): $mn \cdot 4 \cdot 3^{L-1}$.

    Variables:
        trie: nested dict; edges are chars; terminal stored as '$' -> full word.
        parent: trie node for the current prefix (the dict that should contain the next char).
        node: child trie node after consuming current board char.
        res: collected unique words.
    Expressions:
        'setdefault(c, {})' : key=`c`, default=`{}` → if key exists → return its value; if key does not exist → insert key = default and return default
        'node = node.setdefault(c, {})': follow/create the child dict for char c.
        'if (c := board[i][j]) not in parent': prefix mismatch -> stop immediately.
        'res.append(node.pop("$"))': found a full word; record once; remove '$' to avoid duplicates.
        'if not node: parent.pop(c)': child dict became empty -> prune this edge from its parent.
        'board[i][j] = "#" / board[i][j] = c': mark/unmark visited for the current path.



    """
    trie = {}
    for word in words:
        node = trie
        for c in word:
            node = node.setdefault(c, {})
        node["$"] = word  # terminal marker stores full word

    def dfs(i: int, j: int, parent: dict) -> None:

        # Bounds + prefix check: if current cell's char isn't a trie edge, this path is dead.
        if not (0 <= i < m and 0 <= j < n) or (c := board[i][j]) not in parent:
            return

        node = parent[c]  # consume char c in the trie
        if "$" in node:
            res.append(node.pop("$")) # Terminal reached: emit the word once, then delete terminal to prevent duplicates.
        board[i][j] = "#"  # mark visited so we don't reuse this cell in the same word

        for x, y in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):# Explore 4-neighbors continuing from the trie child node.
            dfs(x, y, node)
        board[i][j] = c  # restore cell for other DFS starts/paths

        if not node:
            parent.pop(c)  # Destructive pruning: if this trie node has no outgoing edges (and no '$'), remove it.

    m, n, res = len(board), len(board[0]), []
    for i in range(m):
        for j in range(n):
            if board[i][j] in trie:  # only start where first char exists in trie
                dfs(i, j, trie)

    return res
