

def congruent1(a: int, b: int, n: int) -> bool:
    """
    a ≡ b (mod n)
    Args:
        a: the first number2
        b: the second number
        n: the modulus, the number by which we are dividing
    Returns:
        bool
    """
    return (a - b) % n == 0
