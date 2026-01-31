from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        it = iter(preorder)                              # preorder iterator that yields subtree roots in the exact order recursive calls are made
        idx = {v: i for i, v in enumerate(inorder)}      # map each value to its inorder index so we can split subtrees in O(1) time

        def build(l: int, r: int) -> TreeNode | None:
            if l > r:                                    # when the inorder slice is empty there is no subtree to build
                return None                              # return None to signal an empty child

            v = next(it)                                 # consume exactly one preorder value which is the root of the current inorder slice [l, r]
            m = idx[v]                                   # locate that root in inorder to determine how the preorder stream must be split between left and right subtrees

            return TreeNode(                              # construct the current subtree node and recursively attach its children
                v,                                       # assign the root value that preorder selected for this subtree
                build(l, m - 1),                          # recursively build the left subtree which consumes the next preorder values belonging to inorder[l..m-1]
                build(m + 1, r),                          # recursively build the right subtree which consumes the remaining preorder values belonging to inorder[m+1..r]
            )

        return build(0, len(inorder) - 1)                 # start recursion with the full inorder range to build the entire tree
