from collections import deque

def binary_tree_level_order_traversal(root) -> list[list[int]]:
    """
    Intuition:
        The core logic hinges on the inner `for` loop
        The expression `len(queue)` takes a "snapshot" of the number of nodes on the current level before the loop begins. The loop then dequeues and processes exactly that many nodes, ensuring that only nodes from the current level are handled while their children are queued up for the next iteration. This technique is the key to cleanly separating the levels.

    Time Complexity:
        O(N)
        where N is the total number of nodes in the tree. This is optimal as every node must be visited once.
    
    Args:
        root: Root node of the binary tree
    
    Returns:
        List of lists, where each inner list contains values of nodes at the same level
    """
    
    if not root:
        return []
    queue, result = deque([root]), []
    while queue:
        level = [] 
        for _ in range(len(queue)):  # Process nodes at the current level
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
