


def rob(houses: list[int]) -> int:
    """
    Intuition:
        
        Deep Dive: Subproblems: dp(i) = maximum money obtainable robbing prefix `houses[0..i]
        for 0 ≤ i < n.  (*[14!]prefix ≙ starting from 0 until i*)
       
        Deep Dive: Relation: dp(i) = max(dp(i-1), houses[i] + dp(i-2))
            Either skip house `i` (best stays `dp(i-1)`)
            or rob it and skip `i-1` (best is `houses[i] + dp(i-2)`)
        
        Deep Dive: Topo. order: Increasing i 
            Increasing i  (i = 0, 1, ..., n-1)
        
        Deep Dive: Base: dp(0)
            max money obtainable robbing the empty prefix `houses[0..0]`
        
        Deep Dive: Original: dp(n)
            maximum money obtainable robbing prefix `houses[0..n-1]` (the whole array)
        
    Time Complexity:
        O(n):
        *Θ(n)* subproblems, *Θ(1)* work each → *Θ(n)* total

    Variables:
        h1 : the best total so far (that is, dp(i-1), the best up to the previous house).
        h2 : the best total up to two houses ago (dp(i-2)).
    Expressions:
        'h2, h1 = h1, max(h1, h2 + h)': choose best between:
            - skipping this house → keep h1 (dp(i-1))
            - robbing this house → add h to h2 (dp(i-2) + h)
    """
    h1, h2 = 0, 0
    for h in houses:
        h2, h1 = h1, max(h1, h2 + h)
    return h1


    