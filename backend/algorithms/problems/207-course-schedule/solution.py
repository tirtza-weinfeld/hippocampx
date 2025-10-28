from collections import deque

class Solution:
    def canFinish(self, n: int, prerequisites: list[list[int]]) -> bool:
        """

        
        Determine if all courses can be completed using Kahn’s algorithm (BFS topological sort).

        Intuition:
            1. **Model**
            Each course = a node.
            Each prerequisite `[a, b]` = a directed edge `b → a` (“b before a”).
            
            2. **Goal**
            Can we take all courses = does the graph have **no cycle**?
            If a cycle exists, you’ll never get a course with indegree 0 again.
            
            3. **Idea (Kahn’s algorithm)**
            Compute **indegree** for each node (how many prereqs it has)
            Put all nodes with indegree 0 into a queue (they’re ready)
            While queue not empty:
                Pop one → mark as taken
                For each neighbor (course unlocked by it), decrement indegree
                If indegree becomes 0 → enqueue it
            If you’ve taken all courses → no cycle → return True
            Otherwise → cycle → return False

        Variables:
            taken : counter for how many courses we've "completed"
            g: `g[b]` = list of courses unlocked by taking `b`
            indeg: `indeg[a]` =  number of prerequisites left for course `a`
        Expressions:
            'g[b].append(a)':   add edge `b → a`
            'indeg[a] += 1':    a has one more incoming edge
            'deque(i for i, d in enumerate(indeg) if d == 0)' : Initialize queue with all courses having no prerequisites
            'u = q.popleft()' : take a course with no remaining prereqs
            'taken += 1' : increment the counter for how many courses we've "completed"
            'for v in g[u]' : for each course unlocked by u
            'indeg[v] -= 1' : one prerequisite is now satisfied
            'if indeg[v] == 0' : if no prereqs left
            'q.append(v)' : course is now ready to take
            'taken == n' : If we managed to take all n courses, there was no cycle
            'while q' : Process courses in BFS order
            


        Args:
            prerequisites : $prerequisites[i]=[a_i, b_i]$ indicates that you *must* take course *$b_i$* first before taking course $a_i$ *(b → a)*
            
        """
        g = [[] for _ in range(n)]     
        indeg = [0] * n                
        for a, b in prerequisites:
            g[b].append(a)             
            indeg[a] += 1              

        q = deque(i for i, d in enumerate(indeg) if d == 0)
        taken = 0                      

        while q:
            u = q.popleft()             
            taken += 1
            for v in g[u]:              
                indeg[v] -= 1           
                if indeg[v] == 0:       
                    q.append(v)         

        return taken == n
