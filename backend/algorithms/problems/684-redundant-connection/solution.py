class Solution:

    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:

        p = [*range(len(edges) + 1)]

        def union(a, b):
            p[a] = b

        def find(x):
            while x != p[x]:
                p[x] = p[p[x]]
                x = p[x]
            return x

        for u, v in edges:
            if (a := find(u)) == (b := find(v)):
                return [u, v]
            union(a, b)
        return [] 


