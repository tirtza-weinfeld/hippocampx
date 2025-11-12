def mySqrt(x: int) -> int:
    """
    Intuition:
    
        We need the integer part of √x:
            Start with a guess `r = x`.
                If `r` is **too large**, `r²` exceeds `x`.
                Dividing `x // r` gives a value **too small**, since dividing by something too big shrinks the result.
                The true √x lies **between** these two — `x//r` and `r`.
                Averaging them, $r_{\\text{new}} = \\left\\lfloor \\frac{r + \\lfloor x / r \\rfloor}{2} \\right\\rfloor$,
                moves the guess to the midpoint, cutting the error sharply.
            Each step refines the balance:
                if `r² > x`, the average drops lower;
                once `r² ≤ x`, we stop.
            This “balance-and-refine” loop homes in on √x extremely fast — often in under 6–7 steps.

        Correctness follows from the invariant:
            √x always remains between `x//r` and `r`.
                Since `r² > x ⇒ r > √x ⇒ √x > x/r ⇒ x//r ≤ √x < r`.
                The update average stays inside that interval: *$x//r ≤ r_{\\text{new}} < r$*,
                ensuring `r` decreases but never falls below √x.
                Because r strictly drops while staying ≥ 1, the loop must stop when `r² ≤ x`.
                At that point, r is the largest integer with `r² ≤ x`, i.e. ⌊√x⌋.

    Time Complexity:
        O(log x) iterations in the worst case, typically constant for 32-bit inputs.
        Each update:
        $$r_{\\text{new}} = \\frac{r + x//r}{2}$$
        halves the relative error — the method shows **quadratic convergence**:
        $$E_{k+1} ≈ c·E_k^2$$
        meaning the number of correct digits doubles each step.
        Space is constant, storing only `x` and `r`.

    Args:
        x: Non-negative integer to take the square root of


    Returns:
        The floor of √x.
    
    Expressions:
        'r * r > x':  Loop continues while r is an overestimate of √x
        '(r + x // r) // 2':  Integer form of Newton’s update — averages the overestimate (r) and the underestimate (x//r)

    Variables:
        r: Current approximation of √x, refined each step
   
    """

    if x < 2: return x
    r = x
    while r * r > x: # Stops once r is small enough that its square fits under x
        r = (r + x // r) // 2 #  Replace r with a refined, closer guess
    return r