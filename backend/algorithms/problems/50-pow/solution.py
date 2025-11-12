def myPow(x: float, n: int) -> float:
    r"""
    Intuition:
    
        We need to compute $x^n$ efficiently (for both positive and negative n):
            The naive O(n) approach multiplies x repeatedly — too slow.
            Instead, use **binary exponentiation** (exponentiation by squaring):
                Express n in binary; each bit decides whether to include a corresponding power of x.
                When n is even:
                    $x^n = (x^2)^{n/2}$
                When n is odd:
                    $x^n = x \times x^{n-1}$
                Repeatedly square the base (x → x² → x⁴ → x⁸ ...) and halve n each step.
                If n is odd, multiply the current base into the result.
            For negative exponents:
                $x^n = \frac{1}{x^{-n}}$
            This reduces multiplications from O(n) to O(log |n|).

        Correctness:
            The base case: any $x^0 = 1$.
            If n < 0, we use the reciprocal to invert the result.
            Each iteration processes one bit of n’s binary representation while maintaining the invariant:
            $$\text{result} \times \text{base}^{\text{remaining bits}} = x^n$$
            After all bits are processed, result = $x^n$.
            Squaring ensures every power-of-two component appears exactly once.

    Time Complexity:
        O(log |n|) iterations since n halves each step.
        O(1) space for the iterative version, or O(log |n|) if recursive.
        Each update:
        $$\text{if bit = 1: } result \times= base$$
        $$base \times= base$$
        $$n \div= 2$$
        Each loop handles one binary digit of n.

    Args:
        x: Base (float)
        n: Exponent (integer, may be negative)

    Returns:
        The value of $x^n$.

    Expressions:
        'if n < 0: return 1 / myPow(x, -n)': handle negative exponents via reciprocal
        'while n > 0: if n & 1: result *= base': multiply when the bit is 1
        'base *= base': square the base for the next bit
        'n >>= 1': shift exponent right (integer divide by 2)

    Variables:
        base: current power of x being considered (x, x², x⁴, …)
        result: cumulative product for bits set to 1 in n
        n: remaining exponent to process
    """
    if n == 0: return 1.0
    if n < 0: return 1.0 / myPow(x, -n)
    result, base = 1.0, x
    while n:
        if n & 1:
            result *= base
        base *= base
        n //= 2
    return result
