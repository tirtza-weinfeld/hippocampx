def mod(a: int, b: int) -> int:
    """
    a mod b
    Args:
        a: the first number
        b: the second number
    Returns:
        int
    """
    return a % b



def congruent1(a: int, b: int, n: int) -> bool:
    """
    a ≡ b (mod n)
    Args:
        a: the first number
        b: the second number
        n: the modulus, the number by which we are dividing
    Returns:
        bool
    """
    return (a - b) % n == 0  


def congruent2(a: int, b: int, n: int) -> bool:
    """
    a ≡ b (mod n)
    Args:
        a: the first number
        b: the second number
        n: the modulus, the number by which we are dividing
    Returns:
        bool
    """ 
    return a % n == b % n