from collections import defaultdict


def car_pooling(trips, capacity):
    location = defaultdict(int)
    for p, s, e in trips:
        location[s] += p
        location[e] -= p

    onboard = 0
    for _, p in sorted(location.items()):
        onboard += p
        if onboard > capacity:
            return False
    return True
