def binary_tree_maximum_path_sum(root) -> int:
    """

    """
    best = float("-inf")
    def dfs(node):
        """
        Variables:
            l: left gain
            r: right gain

        Expressions:
            'best = max(best, node.val + l + r)'  :  path through node
            'return node.val + max(l, r)'  :  best upward gain
        """
        nonlocal best
        if not node:
            return 0
        l = max(dfs(node.left), 0)
        r = max(dfs(node.right), 0)
        best = max(best, node.val + l + r)
        return node.val + max(l, r)

    dfs(root)
    return best
