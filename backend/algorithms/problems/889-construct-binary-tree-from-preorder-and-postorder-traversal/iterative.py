from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Solution:
    def constructFromPrePost(self, pre: list[int], post: list[int]) -> TreeNode | None:
        if not pre:
            return None                                # No nodes → empty tree

        root = TreeNode(pre[0])                        # First preorder value is always the root
        stack, j = [root], 0                           # Stack = path of open nodes, j = postorder index

        for v in pre[1:]:                              # Process remaining preorder values
            node = TreeNode(v)                         # Create the next node to attach
            while stack[-1].val == post[j]:            # While the top subtree is complete (postorder says so)
                stack.pop()                            # Close that subtree
                j += 1                                 # Advance postorder pointer

            parent = stack[-1]                         # Current open node to attach a child to
            if parent.left is None:
                parent.left = node                    # Preorder guarantees left child is filled first
            else:
                parent.right = node                   # If left exists, attach as right child

            stack.append(node)                         # New node may receive children next

        return root
