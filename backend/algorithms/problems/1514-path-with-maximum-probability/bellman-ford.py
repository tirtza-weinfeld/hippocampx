class Solution:
    def maxProbability(self, n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
        """
        Intuition:
            Bellman-Ford variant to maximize product of probabilities.
            Each node tracks the maximum probability to reach it from `start`.
    
        Args:
            n: number of nodes
            edges: edges[i] = [u, v] is an undirected edge connecting the nodes u and v with a probability of success of traversing that edge succProb[i].
            succProb: list of probabilities, e.g. [0.5,0.5,0.2],
        """
        prob = [0.0] * n # rob[i] stores max probability to reach node i
        prob[start] = 1.0  # Start with full certainty
    
        for _ in range(n - 1):  # Perform up to n-1 rounds of relaxation
            updated = False
            for (u, v), p in zip(edges, succProb):
                if prob[u] * p > prob[v]:  # Try to improve v through u
                    prob[v] = prob[u] * p
                    updated = True
                if prob[v] * p > prob[u]:  # Try to improve u through v (undirected graph)
                    prob[u] = prob[v] * p
                    updated = True
            if not updated:
                break  # Early exit if no updates in this round
            
        return prob[end]
    