#!/usr/bin/env python3
"""
Filter uses.json to only include entries that have corresponding entries in symbol_tags.json.

This script reads both files and creates a filtered version of uses.json containing
only the entries whose 'qname' field matches a key in symbol_tags.json.
"""

import argparse
import json
import sys
from pathlib import Path


def load_json(file_path: Path) -> dict:
    """Load JSON data from a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {file_path}: {e}")
        sys.exit(1)


def filter_uses_by_symbol_tags(uses_data: dict, symbol_tags_keys: set) -> dict:
    """Filter uses data to only include entries with qnames that exist in symbol_tags."""
    filtered_uses = {}
    
    for filename, entries in uses_data.items():
        filtered_entries = []
        
        for entry in entries:
            qname = entry.get('qname')
            if qname and qname in symbol_tags_keys:
                filtered_entries.append(entry)
        
        # Only include files that have at least one matching entry
        if filtered_entries:
            filtered_uses[filename] = filtered_entries
    
    return filtered_uses


def compact_json(obj, indent=0):
    """Custom compact formatting for ranges (matching generate_uses.py format)."""
    if isinstance(obj, dict):
        if "range" in obj and "qname" in obj:  # use object with range, nameRange, qname, and kind
            range_obj = obj["range"]
            name_range_obj = obj["nameRange"]
            start = range_obj["start"]
            end = range_obj["end"]
            name_start = name_range_obj["start"]
            name_end = name_range_obj["end"]
            qname = json.dumps(obj["qname"])
            kind = json.dumps(obj["kind"])
            return f'{{"range": {{"start": {{"line": {start["line"]}, "character": {start["character"]}}}, "end": {{"line": {end["line"]}, "character": {end["character"]}}}}}, "nameRange": {{"start": {{"line": {name_start["line"]}, "character": {name_start["character"]}}}, "end": {{"line": {name_end["line"]}, "character": {name_end["character"]}}}}}, "qname": {qname}, "kind": {kind}}}'
        else:
            items = []
            for k, v in obj.items():
                key = json.dumps(k)
                if isinstance(v, list) and all(isinstance(item, dict) and "range" in item for item in v):
                    # List of use objects
                    use_items = [compact_json(item, 0) for item in v]
                    uses_str = "[\n" + ",\n".join(f"    {item}" for item in use_items) + "\n  ]"
                    items.append(f"  {key}: {uses_str}")
                else:
                    items.append(f"  {key}: {compact_json(v, indent + 2)}")
            return "{\n" + ",\n".join(items) + "\n}"
    elif isinstance(obj, list):
        return "[" + ", ".join(compact_json(item, indent) for item in obj) + "]"
    else:
        return json.dumps(obj, ensure_ascii=False)


def main():
    """Main function to filter uses.json based on symbol_tags.json."""
    parser = argparse.ArgumentParser(description="Filter uses.json to only include entries with qnames in symbol_tags.json")
    parser.add_argument("--uses", default="lib/extracted-metadata/uses.json",
                        help="Input uses.json file path")
    parser.add_argument("--symbol-tags", default="lib/extracted-metadata/symbol_tags.json",
                        help="Input symbol_tags.json file path")
    parser.add_argument("--out", default="lib/extracted-metadata/filtered_uses.json",
                        help="Output filtered uses.json file path")
    args = parser.parse_args()
    
    # Resolve file paths
    uses_file = Path(args.uses)
    symbol_tags_file = Path(args.symbol_tags)
    output_file = Path(args.out)
    
    # Load the data
    print(f"Loading {uses_file}...")
    uses_data = load_json(uses_file)
    
    print(f"Loading {symbol_tags_file}...")
    symbol_tags_data = load_json(symbol_tags_file)
    
    # Get all keys from symbol_tags for fast lookup
    symbol_tags_keys = set(symbol_tags_data.keys())
    
    print(f"Found {len(symbol_tags_keys)} symbols in symbol_tags.json")
    
    # Count original entries
    original_count = sum(len(entries) for entries in uses_data.values())
    print(f"Found {original_count} total entries in uses.json across {len(uses_data)} files")
    
    # Filter the uses data
    print("Filtering uses.json...")
    filtered_uses = filter_uses_by_symbol_tags(uses_data, symbol_tags_keys)
    
    # Count filtered entries
    filtered_count = sum(len(entries) for entries in filtered_uses.values())
    print(f"Filtered to {filtered_count} entries across {len(filtered_uses)} files")
    print(f"Removed {original_count - filtered_count} entries ({len(uses_data) - len(filtered_uses)} files completely removed)")
    
    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Save the filtered data using the same compact format as generate_uses.py
    print(f"Writing filtered data to {output_file}...")
    output_file.write_text(compact_json(filtered_uses), encoding="utf-8")
    
    print("Filtering complete!")


if __name__ == "__main__":
    main()