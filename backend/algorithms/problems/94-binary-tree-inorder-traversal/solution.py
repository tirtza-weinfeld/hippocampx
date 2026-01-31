from typing import TYPE_CHECKING

if TYPE_CHECKING:  # TreeNode is only used in type hints, not at runtime
    from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Solution:
    def inorderTraversal(self, node: TreeNode | None) -> list[int]:
        return (
            [] if not node
            else self.inorderTraversal(node.left)
            + [node.val]
            + self.inorderTraversal(node.right)
        )
