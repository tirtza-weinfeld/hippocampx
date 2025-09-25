def getModifiedArray(length: int, updates: list[list[int]]) -> list[int]:
    """
    Args:
        length: The number of days in the itinerary.
        updates: List of [start_day, end_day, change_in_km] updates.
    
    Returns:
        The final daily travel plan after all updates.
    """

    delta = [0] * (length + 1)

    for start_day, end_day, change_in_km in updates:
        delta[start_day] += change_in_km
        delta[end_day + 1] -= change_in_km

    prefix_sum = 0
    return [prefix_sum := prefix_sum + change for change in delta[:-1]]
