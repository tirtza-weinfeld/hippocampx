def myPow(x: float, n: int) -> float:
    r"""
    Intuition:
        Compute $(x^n)$ using **binary exponentiation**:
        Each iteration inspects the lowest bit of n:
            if the bit is 1 → include the current power (base) in the result,
            square the base for the next power-of-two,
            shift n right to move to the next bit.
        For negative n, take the reciprocal and reuse the same logic.

        Example:
            x = 2, n = 13 → 13 (1101₂):
                bit 1 → multiply 2¹
                bit 0 → skip 2²
                bit 1 → multiply 2⁴
                bit 1 → multiply 2⁸
            Result = 2¹ × 2⁴ × 2⁸ = 8192

    Time Complexity:
        O(log n):
        one step per binary digit of n, (The number of bits in n is *$\lfloor \log₂ n \rfloor + 1$* — fixed by the value of n itself.
        It doesn’t matter whether those bits are 0 or 1; the loop processes one bit per iteration, so the total work is always proportional to the bit-length of n, not the bit pattern.)


    Expressions:
        'if n < 0':         return 1 / myPow(x, -n)   (handle negative exponent)
        'n & 1' :            check lowest bit          (1 → use base)
        'base *= base' :     move to next power-of-two (`x` → `x²` → `x⁴` → `x⁸` …)
        'n >>= 1' :          bitwise right shift; same effect as `n //= 2` for `n ≥ 0` 

    Args:
        x: base (float)
        n: exponent (int)

    Returns:
        x raised to the power n.
    """
    if n == 0: return 1.0
    if n < 0: return 1.0 / myPow(x, -n)

    result, base = 1.0, x
    while n:
        if n & 1:
            result *= base
        base *= base
        n >>= 1     
    return result
