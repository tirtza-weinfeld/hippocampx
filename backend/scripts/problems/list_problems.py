#!/usr/bin/env python3
"""
Script to list existing problem numbers.

Usage:
    python3 backend/scripts/problems/list_problems.py           # List all problem numbers
    python3 backend/scripts/problems/list_problems.py 1 2 3    # Check which of these exist
"""

import sys
from pathlib import Path


def get_existing_problems(root_path: Path) -> dict[int, str]:
    """Get all existing problem numbers and their folder names."""
    problems = {}
    for folder in root_path.iterdir():
        if folder.is_dir() and "-" in folder.name:
            try:
                number = int(folder.name.split("-")[0])
                problems[number] = folder.name
            except ValueError:
                continue
    return problems


def main() -> None:
    root_path = Path("backend/algorithms/problems")
    if not root_path.exists():
        print(f"Error: Root path '{root_path}' does not exist.", file=sys.stderr)
        sys.exit(1)

    existing = get_existing_problems(root_path)

    if len(sys.argv) == 1:
        # No arguments: list all problem numbers
        sorted_numbers = sorted(existing.keys())
        print(f"Found {len(sorted_numbers)} problems:\n")
        for num in sorted_numbers:
            print(f"  {num}: {existing[num]}")
    else:
        # Arguments provided: check which exist
        requested = []
        for arg in sys.argv[1:]:
            try:
                requested.append(int(arg))
            except ValueError:
                print(f"Warning: '{arg}' is not a valid number, skipping.")

        found = []
        missing = []
        for num in requested:
            if num in existing:
                found.append((num, existing[num]))
            else:
                missing.append(num)

        if found:
            print(f"Existing ({len(found)}):")
            for num, name in sorted(found):
                print(f"  {num}: {name}")

        if missing:
            print(f"\nMissing ({len(missing)}):")
            for num in sorted(missing):
                print(f"  {num}")


if __name__ == "__main__":
    main()
