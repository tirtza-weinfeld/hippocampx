from typing import TYPE_CHECKING

if TYPE_CHECKING:  # TreeNode is only used in type hints, not at runtime
    from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Solution:
    def preorderTraversal(self, node: TreeNode | None) -> list[int]:
        return (
            [] if not node
            else [node.val]
            + self.preorderTraversal(node.left)
            + self.preorderTraversal(node.right)
        )  # same as `return [node.val, *self.preorderTraversal(node.left), *self.preorderTraversal(node.right)] if node else []`
