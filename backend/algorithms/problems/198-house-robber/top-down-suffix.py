


def rob(houses: list[int]) -> int:
    """
    Expressions:
        'max(dp(i + 1), houses[i] + dp(i + 2))':  Either skip house `i` *[1!](best stays `dp(i+1)`)* 
            or rob it and skip `i+1` *[2!](best is `houses[i] + dp(i+2)`)*
    Intuition:    
        Deep Dive: Subproblems: dp(i) = maximum money obtainable robbing **suffix** `houses[i..n-1]`, \
            for 0 ≤ i ≤ n.  (*[4!]suffix ≙ starting from i until the end*)
        
        Deep Dive: Relation: dp(i) = max(dp(i+1), houses[i] + dp(i+2))
            Either skip house `i` (best stays `dp(i+1)`)
            or rob it and skip `i+1` (best is `houses[i] + dp(i+2)`)
            
        Deep Dive: Topo. order: Decreasing i
            Subproblems `dp(i)` depend solely on strictly larger `i` so acyclic
        
        Deep Dive: Base: dp(n)
            max money obtainable robbing the empty suffix `houses[n..n]`
        
        Deep Dive: Original: dp(0)
            maximum money obtainable robbing suffix `houses[0..n-1]` (the whole array)
  
           
    Time Complexity:
        O(n):
        *Θ(n)* subproblems, *Θ(1)* work each → *Θ(n)* total (with memoization)
 
    """

    memo = {}
    def dp(i: int) -> int:
        if i >= len(houses):
            return 0
        if i not in memo:
            memo[i] = max(dp(i + 1), houses[i] + dp(i + 2))
        return memo[i]

    return dp(0)

