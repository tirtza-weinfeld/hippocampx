#!/usr/bin/env python3
"""
Script to generate a new problem folder structure.

Usage:
    python3 backend/scripts/problems/create_problem.py
"""

import sys
from pathlib import Path


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    return text.lower().replace(" ", "-")


def create_init_file(
    title: str,
    definition: str,
    url: str,
    difficulty: str,
    topics: list[str],
) -> str:
    """Generate __init__.py content with problem metadata."""
    topics_str = ", ".join(topics)
    return f'''"""
Title: {title}
Definition: {definition}
Leetcode: {url}
Difficulty: {difficulty}
Topics: [{topics_str}]
"""

'''


def create_solution_file(function_name: str) -> str:
    """Generate solution.py template."""
    return f'''def {function_name}():
    pass
'''


def create_problem_folder(
    number: int,
    title: str,
    definition: str,
    url: str,
    difficulty: str,
    topics: list[str],
    root_path: Path,
) -> None:
    """Create problem folder with all necessary files."""
    # Create folder name
    slug = slugify(title)
    folder_name = f"{number}-{slug}"
    folder_path = root_path / folder_name

    # Create folder (allow overwrite since we already prompted)
    folder_path.mkdir(parents=True, exist_ok=True)
    print(f"Created folder: {folder_path}")

    # Create __init__.py
    init_content = create_init_file(title, definition, url, difficulty, topics)
    init_path = folder_path / "__init__.py"
    init_path.write_text(init_content)
    print(f"Created: {init_path}")

    # Create solution.py
    function_name = slug.replace("-", "_")
    solution_content = create_solution_file(function_name)
    solution_path = folder_path / "solution.py"
    solution_path.write_text(solution_content)
    print(f"Created: {solution_path}")

    print(f"\n✓ Successfully created problem folder: {folder_name}")


def prompt_input(prompt_text: str, required: bool = True) -> str:
    """Prompt user for input with validation."""
    while True:
        value = input(f"{prompt_text}: ").strip()
        if value or not required:
            return value
        print("This field is required. Please enter a value.")


def prompt_number(prompt_text: str) -> int:
    """Prompt user for a number with validation."""
    while True:
        value = input(f"{prompt_text}: ").strip()
        try:
            return int(value)
        except ValueError:
            print("Please enter a valid number.")


def prompt_choice(prompt_text: str, choices: list[str]) -> str:
    """Prompt user for a choice from a list."""
    print(f"\n{prompt_text}")
    for i, choice in enumerate(choices, 1):
        print(f"  {i}. {choice}")
    while True:
        value = input("Enter choice (1-{}): ".format(len(choices))).strip()
        try:
            idx = int(value) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
        except ValueError:
            pass
        print(f"Please enter a number between 1 and {len(choices)}.")


def main() -> None:
    """Prompt for inputs and create problem folder."""
    print("\n=== Create New Problem ===\n")

    # Use default root path
    root_path = Path("backend/algorithms/problems")
    if not root_path.exists():
        print(f"Error: Root path '{root_path}' does not exist.", file=sys.stderr)
        sys.exit(1)

    # Prompt for number and title first to check if problem exists
    number = prompt_number("Problem number (e.g., 1, 121, 1234)")
    title = prompt_input("Problem title (e.g., Two Sum)")

    # Check if folder already exists early
    slug = slugify(title)
    folder_name = f"{number}-{slug}"
    folder_path = root_path / folder_name
    if folder_path.exists():
        print(f"\n⚠️  Problem '{folder_name}' already exists at {folder_path}")
        overwrite = input("Do you want to overwrite it? (y/n): ").strip().lower()
        if overwrite != "y":
            print("Cancelled.")
            sys.exit(0)

    definition = prompt_input("Problem definition/description")
    url = prompt_input("LeetCode problem URL")
    difficulty = prompt_choice("Problem difficulty", ["easy", "medium", "hard"])
    topics_str = prompt_input("Topics (comma-separated, e.g., hash-table,k-sum)")
    topics = [topic.strip() for topic in topics_str.split(",")]

    # Show summary and confirm
    print("\n=== Summary ===")
    print(f"Number: {number}")
    print(f"Title: {title}")
    print(f"Definition: {definition}")
    print(f"URL: {url}")
    print(f"Difficulty: {difficulty}")
    print(f"Topics: {', '.join(topics)}")
    print()

    confirm = input("Create this problem? (Y/n): ").strip().lower()
    if confirm == "n":
        print("Cancelled.")
        sys.exit(0)

    # Create problem folder
    create_problem_folder(
        number=number,
        title=title,
        definition=definition,
        url=url,
        difficulty=difficulty,
        topics=topics,
        root_path=root_path,
    )


if __name__ == "__main__":
    main()
