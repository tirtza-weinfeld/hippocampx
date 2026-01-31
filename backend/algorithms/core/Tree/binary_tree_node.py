

from __future__ import annotations  # postpone evaluation of annotations

from dataclasses import dataclass  # minimal container for tree nodes


@dataclass(slots=True)                                # slots reduce memory and speed attribute access
class TreeNode:
    val: int                                          # value stored at this node
    left: TreeNode | None = None                      # reference to left subtree
    right: TreeNode | None = None
