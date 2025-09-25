
def congruent2(a: int, b: int, n: int) -> bool:
    """
    a ≡ b (mod n)
    Args:
        a: the first number3
        b: the second number
        n: the modulus, the number by which we are dividing
    Returns:
        bool
    """ 
    return a % n == b % n
