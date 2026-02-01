from backend.algorithms.core.Tree.binary_tree_node import TreeNode


class Codec:
    def serialize(self, root: TreeNode):
        return (
            "^#" if not root
            else f"^{root.val}{self.serialize(root.left)}{self.serialize(root.right)}" # Preorder serialization: node -> left -> right
        )  # Use "^" as a delimiter and "#" as a null marker

    def deserialize(self, data):
        preorder = iter(data.lstrip("^").split("^"))

        def build():
            return (
                None if (val := next(preorder)) == "#"
                else TreeNode(
                    val,
                    build(),  # left subtree (comes next in preorder)
                    build(),  # right subtree
                )
            )

        return build()  # Rebuild the entire tree from the preorder stream
