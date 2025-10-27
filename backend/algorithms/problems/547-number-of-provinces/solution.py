class Solution:
    def findCircleNum(self, isConnected: list[list[int]]) -> int:
        """
        Expressions:
            'p = list(range(n := len(isConnected)))': Each node starts as its own parent (each city = its own province)
            'while x != p[x]' : This walks up the chain until it reaches the root.
            'p[x] = p[p[x]]' : flattens the chain → next time find is faster
            'p[find(i)] = find(j)' :  Whenever two cities are connected (`isConnected[i][j]`), we union their groups by linking one root to the other.
            'sum(i == find(i) for i in range(n))' : Counts how many nodes are their own root — each root = one province.

        Intuition:
            Union-Find: 
            We treat each city as a node
            If two cities are connected (directly or indirectly), they belong to the same set or group
            Union-Find (or Disjoint Set Union, DSU) keeps track of which node belongs to which group

        Time Complexity:
            O(n^2):
            *Building connections:* *O(n^2)*
            *Each union/find:* amortized *O(α(n))* 
                *α(n) is the inverse Ackermann function (~constant)*

        """
        p = list(range(n := len(isConnected)))

        def union(a, b):
            """
            merges the sets containing `a` and `b`
            """
            p[find(a)] = find(b)

        def find(x):
            """
            finds the representative (*root*) of the set that *x* belongs to,
            *The representative is just one chosen “leader” of each group*
            """
            while x != p[x]:
                p[x] = p[p[x]]
                x = p[x]
            return x

        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j]:
                    union(i, j)

        return sum(i == find(i) for i in range(n))
