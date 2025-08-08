from collections import defaultdict


class TrieNode:
    """
    A node in the Trie.

    Variables:
        - children: maps characters to child TrieNodes, auto-created on first access
        - end: bool flag indicating this node marks the end of a valid word
        - __slots__: restrict instances to only these attributes (no __dict__) to save memory and speed up attribute access
    """

    __slots__ = ("children", "end")

    def __init__(self):

        self.children: defaultdict[str, TrieNode] = defaultdict(TrieNode)
        self.end = False


class Trie:
    """
    Trie (prefix tree) for storing strings.
    """

    def __init__(self):
        """
        Initializes the Trie with an empty root node.

        Variables:
            - root: the root TrieNode, representing the empty prefix
        """

        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """
        Inserts a word into the Trie.

        Args:
            word: string to insert into the Trie

        Variables:
            - node: current TrieNode during traversal

        Expressions:
        - 'node = node.children[ch]': Traverse to the child node for ch, creating it if missing
        - 'node.end = True': Mark this node as terminating a valid word

        Time Complexity:
          - O(m), where m is the length of the key.
          - Each operation involves examining or creating a node until the end of the key.
        """

        node = self.root
        for ch in word:
            node = node.children[ch]
        node.end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if (node := node.children.get(ch)) is None:
                return False
        return node.end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if (node := node.children.get(ch)) is None:
                return False
        return True


class WordDictionary:
    def __init__(self):
        self.trie: dict[str, dict] = {}
        self.END_MARKER = "$"

    def addWord(self, word: str) -> None:
        node = self.trie
        for c in word:
            node = node.setdefault(c, {})
        node[self.END_MARKER] = True

    def search(self, word: str) -> bool:

        def dfs(node: dict, i: int) -> bool:
            """
            Expressions:
            - 'if k != self.END_MARKER': try every branch except the END_MARKER
            """

            if i == len(word):
                return self.END_MARKER in node

            if (c := word[i]) == ".":

                return any(
                    dfs(child, i + 1)
                    for k, child in node.items()
                    if k != self.END_MARKER
                )
            child = node.get(c)
            return bool(child) and dfs(child, i + 1)

        return dfs(self.trie, 0)


class TrieSolution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:

        trie = {}

        for word in dictionary:
            node = trie
            for c in word:
                if "$" in node:
                    break
                node = node.setdefault(c, {})
            node["$"] = True

        def search(word: str) -> str:
            node = trie
            for i, c in enumerate(word):
                if "$" in node:
                    return word[:i]
                if c not in node:
                    return word
                node = node[c]
            return word

        return " ".join(search(word) for word in sentence.split())



    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:

        """
        Returns all words from 'words' that can be formed in 'board' by sequentially adjacent cells.
        Each cell can be used only once per word. Uses Trie + DFS for optimal search.

        Variables:
            - trie: Build trie from **words** list. Each end node gets a `$` key holding the word
            - m: number of rows
            - n: number of columns
            - res: the list of found words

        Expressions:
            - 'node = node.setdefault(c, {})': create a new node for the character if it doesn't exist
            - 'if "$" in node': if the current node is the end of a word
            - 'res.append(node.pop("$"))': add the word to the result list and remove the "$" key to prevent duplicates
            - 'if not node': prune the trie to remove dead branches.
            - '[dfs' :.. Launch DFS from every cell that matches any trie root key
            - 'board[i][j] = "#"': Mark as visited
            - 'board[i][j] = c': Restore cell
  
        """
        trie = {}  
        for word in words:
            node = trie
            for c in word:
                node = node.setdefault(c, {})
            node["$"] = word


        def dfs(i, j, parent):
            """
            DFS from board[i][j], following *parent* trie node.
            Collects words, marks visited, prunes used-up trie branches.
            """            
            if not (0 <= i < m and 0 <= j < n) or (c := board[i][j]) not in parent:
                return
            node = parent[c]
            if "$" in node:
                res.append(node.pop("$"))
            board[i][j] = "#"
            for x, y in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):
                dfs(x, y, node)
            board[i][j] = c
            if not node:
                parent.pop(c)
                
        m, n, res = len(board), len(board[0]), []
        [dfs(i, j, trie) for i in range(m) for j in range(n) if board[i][j] in trie]

        return res
