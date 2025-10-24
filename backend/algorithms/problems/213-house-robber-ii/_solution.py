import importlib.util
from pathlib import Path

# Import rob function from 198-house-robber solution
_spec = importlib.util.spec_from_file_location(
    'house_robber_198',
    Path(__file__).parent.parent / '198-house-robber' / 'bottom-up.py'
)
_house_robber_module = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_house_robber_module)
simple_rob = _house_robber_module.rob


def rob(houses: list[int]) -> int:
    if len(houses) == 1:
        return houses[0]
    return max(simple_rob(houses[:-1]), simple_rob(houses[1:]))


print(rob([2,3,2]))   