from collections import defaultdict

class TrieNode:
    __slots__ = ("children", "hot")
    def __init__(self):
        self.children = defaultdict(TrieNode)   # automatically creates child nodes on access
        self.hot: list[str] = []               # stores top-3 sentences for this prefix


class AutocompleteSystem:
   
    def __init__(self, sentences: list[str], times: list[int]):
        """
        Instance Attributes:
            root: Trie root
            freq : global frequencies of full sentences
            cur : current node while typing
            buf: current sentence being typed
        """
        self.root = TrieNode()                 
        self.freq = defaultdict(int)          
        self.cur: TrieNode | None = self.root  
        self.buf = ""                          
        for s, t in zip(sentences, times):# insert initial (sentence, frequency) pairs
            self._add(s, t)

    def _add(self, s: str, delta: int) -> None:
        self.freq[s] += delta                  # update global frequency
        node = self.root
        for ch in s:                           # walk prefix path for the sentence
            node = node.children[ch]           # defaultdict creates node if missing
            self._update_hot(node, s)          

    def _update_hot(self, node: TrieNode, s: str) -> None:
        """
        Expressions:
            '(-self.freq[x], x)':  
                sorts by:
                    - Higher frequency first (using -freq to invert Python's ascending sort)
                    - Lexicographically smaller sentence on ties
        """
        if s not in node.hot:
            node.hot.append(s)                 # add sentence if not present
        node.hot.sort(key=lambda x: (-self.freq[x], x))  # reorder by ranking rules
        if len(node.hot) > 3:                  # keep only top-3
            node.hot.pop()

    def input(self, c: str) -> list[str]:
        if c == "#":                           # end of sentence
            if self.buf:
                self._add(self.buf, 1)         # insert the completed sentence
            self.buf = ""                      # reset buffer
            self.cur = self.root               # reset traversal
            return []

        self.buf += c                           # extend current prefix
        self.cur = self.cur.children[c]         # advance in trie (auto-creates missing nodes)
        return self.cur.hot                     # return top-3 for this prefix
