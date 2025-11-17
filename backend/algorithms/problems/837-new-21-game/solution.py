def new21Game(n: int, k: int, maxPts: int) -> float:
    r"""
    Intuition:
        `dp[i]` is the probability that the game **ends** with total score `i`:
        To end at score `i` in one draw, you must have been at some score `j` that:
            was **still active** (`j < k`, so drawing is allowed), and
            was **close enough to reach i** in a single draw (`i - maxPts ≤ j ≤ i - 1`).
        All such `j` values form a sliding window behind `i`.
        The variable `s` keeps the **sum of dp[j] over exactly those valid j**.
        Since every draw 1..maxPts is equally likely, the transition is: *$dp[i] = \frac{s}{\text{maxPts}}$*
        And the answer is the total probability of all **terminal scores** *$i \ge k$* that are also ≤ n.



    Args:
        n: Final score must be ≤ n to count as a win.
        k: Drawing stops the moment the running total reaches ≥ k.
        maxPts: Each draw is an integer from 1..maxPts, uniformly random.

    Variables:
        dp: dp[i] = probability the game ended with total score = i
        s:  sliding window sum of dp[j] for j < k and i-maxPts ≤ j ≤ i-1.

    Time Complexity:
        O(n + maxPts):
        Each index enters and leaves the sliding window once

    Returns:
        The total probability that the final stopped score is ≤ n (i.e., sum over i ≥ k).
    """

    if k == 0 or n >= k + maxPts:
        return 1.0

    dp = [0] * (n + 1)
    dp[0] = s = 1 # start with score 0 at probability 1

    for i in range(1, n + 1):
        dp[i] = s / maxPts  # landing on i = average of reachable previous states
        if i < k:  # i<k means game is still active → dp[i] enters window
            s += dp[i]
        if i - maxPts >= 0 and i - maxPts < k:  # if oldest index was in window, remove it
            s -= dp[i - maxPts]
    return sum(dp[k:])  # sum probabilities of all stopping scores (i≥k)
