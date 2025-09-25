from collections import deque

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def clone_graph(node: Node | None) -> Node | None:
    """
    Clone a connected undirected graph using BFS traversal.
    
    Intuition:
        Hash Map as a Visited Set & Node Cache 🗺️
        The key to traversing a potentially cyclic graph is a `visited` set. Here, the `cloned` dictionary serves a dual purpose. It acts as both a **`visited` set** (by checking `if n not in cloned`) and a **cache** that maps an original node to its clone. This ensures each node is cloned exactly once and prevents getting stuck in an infinite loop.

    Time Complexity:
        O(V + E)
        where V is the number of vertices (nodes) and E is the number of edges. This is optimal as we must visit every node and traverse every edge to create the full copy.
        
    Args:
        node: The node to clone

    Expressions:
        'if n not in cloned' : Check if the node has not been visited
        'cloned[n] = Node(n.val)' : Create a new node for the neighbor
        'queue.append(n)' : Add the neighbor to the queue
        'cloned[cur].neighbors.append(cloned[n])' : Add the neighbor to the current node's neighbors

    Variables:
        cloned : A dictionary that maps an original node to its clone
        queue : A queue that stores the nodes to be visited
        cur : The current node being visited
        n : The neighbor of the current node

    Returns:
        The cloned graph
    """
    if not node:
        return None
    cloned = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        cur = queue.popleft()
        for n in cur.neighbors:
            if n not in cloned:
                cloned[n] = Node(n.val)
                queue.append(n)
            cloned[cur].neighbors.append(cloned[n])
    return cloned[node]
