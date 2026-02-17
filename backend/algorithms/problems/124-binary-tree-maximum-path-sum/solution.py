def binary_tree_maximum_path_sum(root) -> int:
    """
    Intuition:
        Postorder traversal (left → right → node):
            For each node we compute two different quantities:
            1) Upward gain (returned):
               The maximum sum of a path that starts at this node and continues\
               upward through its parent. Since a path is linear, only ONE child\
               branch may be continued upward.
            2) Peak path (local candidate):
               A path whose highest node is the current node:
                    left_gain → node ← right_gain
               This path is complete at this node, so it updates the global maximum.
            Negative child gains are discarded because adding them would strictly\
            decrease any path sum.

    Time Complexity:
        O(n):
        every node is visited once.
    """
    best = float("-inf") # best path sum seen anywhere
    def postorder(node):
        """
        Variables:
            l: left gain
            r: right gain

        Expressions:
            'best = max(best, node.val + l + r)'  :  path with peak at this node
            'return node.val + max(l, r)'  :  best upward gain (best gain extendable to parent)
        """
        nonlocal best
        if not node:
            return 0 # no contribution to parent
        l = max(postorder(node.left), 0)  # keep only beneficial left contribution
        r = max(postorder(node.right), 0) # keep only beneficial right contribution
        best = max(best, node.val + l + r)
        return node.val + max(l, r)

    postorder(root)
    return best
