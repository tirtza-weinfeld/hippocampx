def replace_words(dictionary: list[str], sentence: str) -> str:
    """

    """
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
