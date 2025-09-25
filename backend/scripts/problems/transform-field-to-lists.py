#!/usr/bin/env python3
"""
Transform specified fields from paragraph format into nested list format.

Transforms flat format like:
    "*$O(n log m)$*:\n*$n$* is the number of piles\n*$m$* is the maximum pile size."

Into nested list format like:
    "- *$O(n log m)$*:\n    - *$n$* is the number of piles\n    - *$m$* is the maximum pile size."
"""

import argparse
import json
import re
from pathlib import Path
from typing import List

def transform_to_nested_list(text: str) -> str:
    """Transform text from paragraph to nested list format."""
    if not text or not text.strip():
        return text

    lines = text.split('\n')
    if len(lines) <= 1:
        return text

    transformed_lines = []

    for i, line in enumerate(lines):
        # Preserve empty lines
        if not line.strip():
            transformed_lines.append(line)
            continue

        # Detect existing indentation
        stripped_line = line.lstrip()
        existing_indent = line[:len(line) - len(stripped_line)]

        # First line: add top-level bullet point if needed
        if i == 0:
            if stripped_line.startswith('- '):
                transformed_lines.append(line)
            else:
                transformed_lines.append(f"{existing_indent}- {stripped_line}")
        else:
            # Subsequent lines: add one level of indentation
            if stripped_line.startswith('- '):
                # Already has bullet, add 4 spaces to existing indentation
                transformed_lines.append(f"{existing_indent}    {stripped_line}")
            else:
                # Add bullet and 4 spaces to existing indentation
                transformed_lines.append(f"{existing_indent}    - {stripped_line}")

    return '\n'.join(transformed_lines)

def process_symbol_tags(input_file: Path, output_file: Path, fields: List[str]) -> None:
    """Process symbol tags JSON file and transform specified fields."""
    
    # Read input file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    transformed_count = 0
    
    # Process each symbol entry
    for qname, entry in data.items():
        if not isinstance(entry, dict):
            continue
            
        # Transform specified fields
        for field in fields:
            if field in entry and isinstance(entry[field], str):
                original = entry[field]
                transformed = transform_to_nested_list(original)
                if transformed != original:
                    entry[field] = transformed
                    transformed_count += 1
                    print(f"Transformed '{field}' for: {qname}")
    
    # Write output file with proper formatting
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
    
    print(f"\nTransformation complete!")
    print(f"- Input file: {input_file}")
    print(f"- Output file: {output_file}")
    print(f"- Transformed {transformed_count} field instances")
    print(f"- Fields processed: {', '.join(fields)}")

def main():
    parser = argparse.ArgumentParser(
        description="Transform specified fields from paragraph to nested list format"
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("lib/extracted-metadata/symbol_tags.json"),
        help="Input symbol_tags.json file"
    )
    parser.add_argument(
        "--output", 
        type=Path,
        help="Output file (defaults to input file - transforms in place)"
    )
    parser.add_argument(
        "--fields",
        nargs="+",
        default=["time_complexity", "space_complexity"],
        help="Fields to transform (default: time_complexity space_complexity)"
    )
    
    args = parser.parse_args()
    
    # Default output to input file (transform in place)
    output_file = args.output if args.output else args.input
    
    if not args.input.exists():
        print(f"Error: Input file {args.input} does not exist")
        return 1
    
    try:
        process_symbol_tags(args.input, output_file, args.fields)
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())