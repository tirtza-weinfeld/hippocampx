from collections import deque
from core.Tree.binary_tree_node import TreeNode


class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        """
        Intuition:
            The core logic hinges on the inner `for` loop
            The expression `len(queue)` takes a "snapshot" of the number of nodes on the current level before the loop begins. The loop then dequeues and processes exactly that many nodes, ensuring that only nodes from the current level are handled while their children are queued up for the next iteration. This technique is the key to cleanly separating the levels.

        Time Complexity:
            O(n)
            where n is the total number of nodes in the tree. This is optimal as every node must be visited once.

        Args:
            root: Root node of the binary tree

        Returns:
            List of lists, where each inner list contains values of nodes at the same level
        """
        if not root:
            return []
        q, result = deque([root]), []
        while q:
            level = []
            for _ in range(len(q)):  # Process nodes at the current level
                u = q.popleft()
                level.append(u.val)
                if u.left:
                    q.append(u.left)
                if u.right:
                    q.append(u.right)
            result.append(level)
        return result
