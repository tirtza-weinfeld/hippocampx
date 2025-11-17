def new21Game(n: int, k: int, maxPts: int) -> float:
    """
    
    Args:
        n: Maximum allowed final score when counting a win.
        k: Stopping threshold; drawing stops as soon as the total reaches ≥ k.
        maxPts: Each draw is an integer in [1, maxPts], uniformly at random.

    Returns:
        Probability that the final total score is at most n.

  
    """
    if k == 0 or n >= k + maxPts:
        return 1.0                     # always stop with score ≤ n

    dp = [0.0] * (n + 1)
    dp[0] = 1.0
    win = 1.0                          # sum of last up-to-maxPts dp values

    for i in range(1, n + 1):
        dp[i] = win / maxPts           # probability of landing exactly on i

        if i < k:                      # from i we can still draw again
            win += dp[i]               # expand window on the right

        if i - maxPts >= 0:            # slide window: remove value too far left
            win -= dp[i - maxPts]

    return sum(dp[k:])                 # only scores where we actually stop