#!/usr/bin/env python3
"""
Generate comments-inline.json for inline comment tooltips.

This script extracts inline comments (lines with # ...) from Python files and generates
position data for tooltip rendering. It works by finding comments in the cleaned code
(after docstrings are removed) to ensure line numbers match the rendered code.

The output comments-inline.json contains line number -> comment text mappings.

CLI:
  python3 generate_comments_inline.py \
    --root ../../algorithms/problems \
    --out ../../lib/extracted-metadata/comments-inline.json
"""

import argparse
import json
import sys
from pathlib import Path

# Add current directory to Python path to import utilities
sys.path.insert(0, str(Path(__file__).parent))
from code_cleaner import clean_code


def extract_inline_comments(cleaned_code: str) -> dict[int, str]:
    """
    Extract inline comments from cleaned code.

    Args:
        cleaned_code: Python code with docstrings removed but inline comments preserved

    Returns:
        Dictionary mapping line number (0-based) to comment text
    """
    comments = {}
    lines = cleaned_code.split("\n")

    for line_num, line in enumerate(lines):
        # Find inline comments (not in strings)
        if "#" not in line:
            continue

        # Simple approach: find # not in quotes
        in_string = False
        quote_char = None
        escaped = False

        for i, char in enumerate(line):
            if escaped:
                escaped = False
                continue

            if char == "\\":
                escaped = True
                continue

            if char in ['"', "'"] and not in_string:
                in_string = True
                quote_char = char
            elif char == quote_char and in_string:
                in_string = False
                quote_char = None
            elif char == "#" and not in_string:
                # Found a comment! Extract the text after #
                comment_text = line[i + 1 :].strip()
                if comment_text:  # Only store non-empty comments
                    comments[line_num] = comment_text
                break

    return comments


def extract_file_comments(file_path: Path) -> dict[int, str]:
    """
    Extract all inline comments from a Python file.

    Args:
        file_path: Path to the Python file

    Returns:
        Dictionary mapping line number to comment text
    """
    try:
        # Read the source code
        raw_code = file_path.read_text(encoding="utf-8")

        # Clean the code (remove docstrings but keep inline comments)
        cleaned_code = clean_code(
            raw_code,False,True
        )

        # Extract inline comments from cleaned code
        comments = extract_inline_comments(cleaned_code)

        return comments

    except Exception as e:
        print(f"Warning: Failed to process {file_path}: {e}")
        return {}


def main():
    parser = argparse.ArgumentParser(
        description="Generate comments-inline.json and comments-inline-symbols.json for inline comment tooltips"
    )
    parser.add_argument(
        "--root",
        default="backend/algorithms",
        help="Root directory to scan for Python files",
    )
    parser.add_argument(
        "--out",
        default="lib/extracted-metadata/comments-inline.json",
        help="Output JSON file path for nested structure (transformer use)",
    )
    parser.add_argument(
        "--out-symbols",
        default="lib/extracted-metadata/comments-inline-symbols.json",
        help="Output JSON file path for flat qname structure (renderTooltipContent use)",
    )
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Error: Root directory {root} does not exist")
        return 1

    # Collect inline comments from all Python files
    all_comments: dict[str, list[int]] = {}  # filename -> list of line numbers
    all_symbols: dict[str, str] = {}  # qname -> comment text
    total_comments = 0

    for py_file in root.rglob("*.py"):
        if not py_file.is_file():
            continue

        # Skip hidden directories and __pycache__
        if any(part.startswith(".") or part == "__pycache__" for part in py_file.parts):
            continue

        # Extract inline comments
        file_comments = extract_file_comments(py_file)

        if file_comments:
            rel_path = str(py_file.relative_to(root))

            # Store only line numbers as a sorted list
            all_comments[rel_path] = sorted(file_comments.keys())

            # Store qname -> text mapping for symbols file
            for line_num, comment in file_comments.items():
                qname = f"{rel_path}:comment-line:{line_num}"
                all_symbols[qname] = comment

            total_comments += len(file_comments)
            print(f"Found {len(file_comments)} inline comments in {rel_path}")

    # Write output files
    output_path = Path(args.out)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Write position data only (like expressions.json) - line numbers converted to strings for JSON
    # comments_with_str_keys = {
    #     file: {str(line): None for line in lines.keys()}
    #     for file, lines in all_comments.items()
    # }
    output_path.write_text(
        #   json.dumps(comments_with_str_keys, ensure_ascii=False, indent=2),
        json.dumps(all_comments, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(
        f"\nWrote {output_path} • {total_comments} comment positions from {len(all_comments)} files"
    )

    # Write flat qname -> text mapping (like symbol_tags.json)
    symbols_path = Path(args.out_symbols)
    symbols_path.parent.mkdir(parents=True, exist_ok=True)
    symbols_path.write_text(
        json.dumps(all_symbols, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {symbols_path} • {len(all_symbols)} comment text entries")

    return 0


if __name__ == "__main__":
    sys.exit(main())
