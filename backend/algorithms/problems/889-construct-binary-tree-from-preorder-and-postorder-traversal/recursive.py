from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Solution:
    def constructFromPrePost(self, pre: list[int], post: list[int]) -> TreeNode | None:
        it = iter(pre)                                   # preorder stream: each recursive call consumes its subtree root next
        j = 0                                            # postorder pointer: advances when a subtree is fully completed

        def build() -> TreeNode:
            nonlocal j
            root = TreeNode(next(it))                    # take next preorder value as the root of *this* subtree

            if root.val != post[j]:                      # if post[j] isn't root yet, this subtree still has children
                root.left = build()                      # build a left child first (any valid choice; ambiguity is here)

            if root.val != post[j]:                      # if still not closed, there must also be a right child
                root.right = build()                     # build the right child

            j += 1                                       # now post[j] == root.val → close this subtree and move past it
            return root

        return build() if pre else None                  # empty input → empty tree
