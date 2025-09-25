from collections import defaultdict


class TrieNode:
    """
    A node in the Trie.

    Variables:
        children: maps characters to child TrieNodes, auto-created on first access
        end: bool flag indicating this node marks the end of a valid word
        __slots__: restrict instances to only these attributes (no __dict__) to save memory and speed up attribute access
    """

    __slots__ = ("children", "end")

    def __init__(self):

        self.children: defaultdict[str, TrieNode] = defaultdict(TrieNode)
        self.end = False


class Trie:

    def __init__(self):
        """
        Initializes the Trie with an empty root node.

        Variables:
            root: the root TrieNode, representing the empty prefix
        """

        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """
        Inserts a word into the Trie.

        Args:
            word: string to insert into the Trie

        Variables:
            node: current TrieNode during traversal

        Expressions:
            'node = node.children[ch]': Traverse to the child node for ch, creating it if missing
            'node.end = True': Mark this node as terminating a valid word

        Time Complexity:
          O(m):
          where m is the length of the key.
          Each operation involves examining or creating a node until the end of the key.
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

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if (node := node.children.get(ch)) is None:
                return False
        return True

