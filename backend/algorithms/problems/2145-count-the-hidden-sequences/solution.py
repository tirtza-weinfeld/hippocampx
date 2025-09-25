def numberOfArrays(differences: list[int], lower: int, upper: int) -> int:
    """
    Args:
        differences: List of daily changes (trip segments).
        lower: Lower bound for any marker on the highway.
        upper: Upper bound for any marker on the highway.
    
    Returns:
        The number of valid starting values.
    """

    prefix_sum = min_marker = max_marker = 0

    for diff in differences:
        prefix_sum += diff
        min_marker = min(min_marker, prefix_sum)
        max_marker = max(max_marker, prefix_sum)

    return max(0, (upper - max_marker) - (lower - min_marker) + 1)
