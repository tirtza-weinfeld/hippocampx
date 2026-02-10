def singleNumber(self, nums: list[int]) -> int:
    r"""
    Intuition:
        Finite-state machine:
        Treat each bit position i as an independent finite-state machine that counts how many times that bit has appeared, modulo 3.
        We do NOT store the full count. We only store the remainder
            $c_i \in \{0,1,2\}$ where
            $c_i \equiv \text{(number of times bit i appeared)} \pmod{3}$.
        State encoding (per bit `i`):
            $c_i = 0$
                (bit seen a multiple of 3 times)
                $(x_i, y_i) = (0,0)$
            $c_i = 1$
                (bit seen once modulo 3)
                $(x_i, y_i) = (1,0)$
            $c_i = 2$
                (bit seen twice modulo 3)
                $(x_i, y_i) = (0,1)$
        The combination $(x_i, y_i) = (1,1)$ is illegal and must never occur,
            because $x_i = 1$ encodes $c_i = 1$ and $y_i = 1$ encodes $c_i = 2$.    
            These two statements cannot both be true for the same bit.
        Transition rule (per bit `i`) when reading one number num:
            If $num_i = 0$:
                the bit did not appear → $c_i$ stays unchanged.
            If $num_i = 1$:
                advance the counter:
                $c_i \leftarrow (c_i + 1) \bmod 3$.
            In terms of state pairs:
                $(0,0) \rightarrow (1,0) \rightarrow (0,1) \rightarrow (0,0)$.

        Key mental model:
            x stores all bits whose remainder is 1.
            y stores all bits whose remainder is 2.
            Bitwise operations update all bit positions simultaneously, implementing the modulo-3 state transitions in parallel.
    
    Variables:
        x: integer whose i-th bit $x_i = 1$ iff $c_i = 1$
        y: integer whose i-th bit $y_i = 1$ iff $c_i = 2$
    
    Expressions:
        '^'  : xor → toggles a bit where $num_i = 1$
        '~'  : bitwise not → clears forbidden overlaps
        'x = (x ^ num) & ~y':
            Step A:
                For each bit i with $num_i = 1$, flip $x_i$.
                (Proposed update toward remainder 1.)
            Step B:
                Clear any bit where $y_i = 1$,
                ensuring $(x_i, y_i) \neq (1,1)$.
        'y = (y ^ num) & ~x':
            Step A:
                For each bit i with $num_i = 1$, flip $y_i$.
                (Proposed update toward remainder 2.)
            Step B:
                Clear any bit where the UPDATED $x_i = 1$,
                again preventing $(1,1)$.
                Using updated x ensures one consistent
                $+1 \bmod 3$ transition per bit.
    """
    x = y = 0  # initially: for all i, $c_i = 0$ ⇒ $(x_i, y_i) = (0,0)$
    for num in nums:
        x = (x ^ num) & ~y
        y = (y ^ num) & ~x
    return x  # bits with $c_i = 1$ form the unique number
