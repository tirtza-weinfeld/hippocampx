from collections import Counter


class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        r"""
        Intuition:
            Backtracking on a grid:
                Try to match `word` by walking up/down/left/right, marking a cell as used (`"#"`) so it cannot be reused.
            Strong pruning before DFS:
                1. Length check: if $w > mn$ → impossible(not enough cells to form the word).
                2. Frequency check:
                    A path cannot reuse a cell, so for every character $c$, $\text{wc}[c] \le \text{bc}[c]$ must hold.
                3. Reduce branching:
                    Start DFS from the rarer endpoint by reversing the word when $\text{bc}[\text{word}[0]] > \text{bc}[\text{word}[-1]]$.

        Variables:
            bc: counts how many times each letter exists anywhere on the board
            wc: counts how many times each letter is required by the word

        Expressions:
            'if m * n < w': 1. Length check: if $w > mn$ → impossible(not enough cells to form the word).
            'if any(wc[c] > bc.get(c, 0) for c in wc)': 2. Frequency check: A path cannot reuse a cell, so for every character $c$, $\text{wc}[c] \le \text{bc}[c]$ must hold.
            'if bc[word[0]] > bc[word[-1]]' : 3. Reduce branching: If the first letter is more common than the last letter, search the word backward instead.

        Time Complexity:
            $O(mn \cdot 3^w)$
            Let $m,n$ be board dimensions and $w=\text{len(word)}$.
            Prechecks: $O(mn + w)$.
            DFS worst case: we may start from every cell ($mn$ choices), the first step has at most 4 directions and each subsequent step at most 3 (cannot go back to the previous cell), giving $O(mn \cdot 4 \cdot 3^{w-1}) = O(mn \cdot 3^{w})$.

"""

        m, n, w = len(board), len(board[0]), len(word)
        if m * n < w:
            return False

        bc = Counter(c for row in board for c in row)
        wc = Counter(word)
        if any(wc[c] > bc.get(c, 0) for c in wc):
            return False # impossible: need more of some letter than board has

        if bc[word[0]] > bc[word[-1]]:
            word = word[::-1] # start DFS from rarer endpoint to reduce branching

        def dfs(r: int, c: int, i: int) -> bool:
            if i == w:
                return True

            if 0 <= r < m and 0 <= c < n and board[r][c] == word[i]:
                board[r][c] = "#" # mark visited (cannot reuse cell)
                if dfs(r - 1, c, i + 1) or dfs(r + 1, c, i + 1) or dfs(r, c - 1, i + 1) or dfs(r, c + 1, i + 1):
                    return True
                board[r][c] = word[i] # backtrack: restore cell
            return False # dead end

        return any(
            dfs(r, c, 0)
            for r, row in enumerate(board)
            for c, ch in enumerate(row)
            if ch == word[0]
        )
