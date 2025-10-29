from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return [] 

        result, q = [], deque([root])  # queue for BFS traversal
        while q:
            result.append([n.val for n in q])  # collect current level values
            for _ in range(len(q)):  # process all nodes at this level
                node = q.popleft()
                if node.left: 
                    q.append(node.left)
                if node.right:  
                    q.append(node.right)
        return result 