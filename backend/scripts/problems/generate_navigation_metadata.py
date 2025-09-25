#!/usr/bin/env python3
"""
Generate navigation metadata for the problems navigation component.

This script extracts focused metadata specifically for navigation:
- Filtering by difficulty, topics, patterns
- Searching by title, definition, leetcode info
- Clean, minimal structure for fast UI performance

Output JSON shape:
{
  "problems": [
    {
      "slug": "maximum_subarray",
      "title": "Maximum Subarray", 
      "definition": "Given an array...",
      "difficulty": "medium",
      "topics": ["kadane", "array"],
      "patterns": ["optimization"],
      "leetcode": {
        "number": 53,
        "title": "Maximum Subarray",
        "url": "https://leetcode.com/problems/maximum-subarray/"
      },
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)"
    }
  ],
  "categories": {
    "difficulties": {"easy": 12, "medium": 25, "hard": 8},
    "topics": {"array": 15, "graph": 8, "tree": 12},
    "patterns": {"two_pointers": 6, "sliding_window": 4}
  }
}
"""

import argparse
import ast
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Union


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    return text.lower().replace('_', '-').replace(' ', '-')


def parse_leetcode_info(text: str) -> Optional[Dict[str, Union[str, int]]]:
    """Parse LeetCode info from various formats."""
    if not text.strip():
        return None
    
    text = text.strip()
    
    # Format: [123. Problem Name](url)
    markdown_match = re.search(r'\[(\d+)\.\s*([^\]]+)\]\(([^)]+)\)', text)
    if markdown_match:
        number, title, url = markdown_match.groups()
        return {
            "number": int(number),
            "title": title.strip(),
            "url": url.strip()
        }
    
    # Format: 123. Problem Name | url
    pipe_match = re.search(r'(\d+)\.\s*([^|]+)\s*\|\s*(.+)', text)
    if pipe_match:
        number, title, url = pipe_match.groups()
        return {
            "number": int(number),
            "title": title.strip(),
            "url": url.strip()
        }
    
    # Format: just number and title
    number_match = re.search(r'(\d+)\.\s*(.+)', text)
    if number_match:
        number, title = number_match.groups()
        return {
            "number": int(number),
            "title": title.strip()
        }
    
    return None


def parse_list_field(text: str) -> List[str]:
    """Parse comma/newline separated list, preserving underscores."""
    if not text.strip():
        return []
    
    # First try comma separation
    if ',' in text:
        items = [item.strip() for item in text.split(',')]
        return [item for item in items if item and not item.startswith(('*', '(', ')', '[', ']'))]
    
    # Then try newline separation for multi-line lists
    if '\n' in text:
        items = [item.strip() for item in text.split('\n')]
        return [item for item in items if item and not item.startswith(('*', '(', ')', '[', ']'))]
    
    # Single item - just clean it
    clean_text = text.strip()
    if clean_text and not clean_text.startswith(('*', '(', ')', '[', ']')):
        return [clean_text]
    
    return []


def extract_complexity(text: str) -> Optional[str]:
    """Extract Big O notation from Time/Space Complexity section."""
    if not text.strip():
        return None
    
    # Look for the Big O notation pattern
    import re
    
    # Find the first occurrence of $...$ (math notation)
    math_match = re.search(r'\$([^$]+)\$', text)
    if math_match:
        return f"${math_match.group(1).strip()}$"
    
    # Fallback: take first meaningful part (before any asterisks or explanations)
    parts = text.split('*')
    first_part = parts[0].strip()
    if first_part:
        return first_part
    
    # Last resort: return the text as-is
    return text.strip()


def extract_problem_metadata(node: Union[ast.FunctionDef, ast.ClassDef], file_path: str) -> Optional[Dict]:
    """Extract navigation-focused metadata from function/class docstring."""
    docstring = ast.get_docstring(node, clean=True)
    if not docstring:
        # Try to find string literal as first statement
        if (node.body and isinstance(node.body[0], ast.Expr) 
            and isinstance(node.body[0].value, ast.Constant) 
            and isinstance(node.body[0].value.value, str)):
            docstring = node.body[0].value.value
        else:
            return None
    
    # Initialize result
    result = {
        "slug": slugify(node.name),
        "name": node.name,
        "title": node.name.replace('_', ' ').title(),
        "filename": Path(file_path).stem
    }
    
    # Parse sections from docstring
    lines = [line.strip() for line in docstring.splitlines()]
    current_section = "definition"
    sections = {
        "definition": [],
        "title": [],
        "difficulty": [],
        "topics": [],
        "patterns": [],
        "leetcode": [],
        "time_complexity": [],
        "space_complexity": [],
        "intuition": []
    }
    
    for line in lines:
        if not line:
            continue
            
        line_lower = line.lower()
        
        # Check for section headers (only recognize known sections to avoid bleeding)
        section_found = None
        
        if line_lower.startswith('title:'):
            section_found = "title"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('definition:'):
            section_found = "definition"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('difficulty:'):
            section_found = "difficulty"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('topics:'):
            section_found = "topics"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('patterns:'):
            section_found = "patterns"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('leetcode:'):
            section_found = "leetcode"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('time complexity:'):
            section_found = "time_complexity"
            content = line[16:].strip()
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('space complexity:'):
            section_found = "space_complexity"
            content = line[17:].strip()
            if content:
                sections[section_found].append(content)
        elif line_lower.startswith('intuition:'):
            section_found = "intuition"
            content = line.split(':', 1)[1].strip() if ':' in line else ''
            if content:
                sections[section_found].append(content)
        elif line_lower.strip() in ['args:', 'returns:', 'expressions:', 'variables:', 'expressions', 'variables', 'args', 'returns']:
            # Skip these sections for navigation metadata
            current_section = "skip"
            continue
        else:
            # Only add to current section if it's a recognized navigation section and not skipping
            if current_section not in ["skip"] and current_section in sections:
                # Skip lines that look like they're from other sections
                if not (line.startswith("'") or line.startswith('"') or 
                        line.startswith('(') or line.startswith('[') or
                        ':' in line and not line.startswith(' ')):
                    sections[current_section].append(line)
        
        if section_found:
            current_section = section_found
    
    # Process sections into final metadata
    
    # Title
    title_text = ' '.join(sections["title"]).strip()
    if title_text:
        result["title"] = title_text
    
    # Definition (required for navigation)
    definition_text = ' '.join(sections["definition"]).strip()
    if definition_text:
        result["definition"] = definition_text
    else:
        # Skip problems without definitions
        return None
    
    # Difficulty (normalize to standard values)
    difficulty_text = ' '.join(sections["difficulty"]).strip().lower()
    difficulty_map = {
        'easy': 'easy',
        'medium': 'medium', 
        'hard': 'hard',
        'expert': 'expert',
        'beginner': 'easy',
        'intermediate': 'medium',
        'advanced': 'hard'
    }
    if difficulty_text in difficulty_map:
        result["difficulty"] = difficulty_map[difficulty_text]
    
    # Topics
    topics_text = ' '.join(sections["topics"]).strip()
    topics = parse_list_field(topics_text)
    if topics:
        result["topics"] = topics
    
    # Patterns
    patterns_text = ' '.join(sections["patterns"]).strip()
    patterns = parse_list_field(patterns_text)
    if patterns:
        result["patterns"] = patterns
    
    # LeetCode
    leetcode_text = ' '.join(sections["leetcode"]).strip()
    leetcode = parse_leetcode_info(leetcode_text)
    if leetcode:
        result["leetcode"] = leetcode
    
    # Complexity
    time_complexity_text = ' '.join(sections["time_complexity"]).strip()
    time_complexity = extract_complexity(time_complexity_text)
    if time_complexity:
        result["timeComplexity"] = time_complexity
    
    space_complexity_text = ' '.join(sections["space_complexity"]).strip()
    space_complexity = extract_complexity(space_complexity_text)
    if space_complexity:
        result["spaceComplexity"] = space_complexity
    
    return result


def is_main_problem_function(node: Union[ast.FunctionDef, ast.ClassDef], file_path: str) -> bool:
    """Check if this is a main problem function/class (not a helper)."""
    filename = Path(file_path).stem
    
    # For classes, check if class name matches filename or has problem metadata
    if isinstance(node, ast.ClassDef):
        docstring = ast.get_docstring(node, clean=True)
        return docstring and ('leetcode' in docstring.lower() or 'definition' in docstring.lower())
    
    # For functions, prefer those that match filename or are top-level with problem metadata
    if isinstance(node, ast.FunctionDef):
        docstring = ast.get_docstring(node, clean=True)
        
        # Must have problem metadata (Definition section)
        if not (docstring and 'definition' in docstring.lower()):
            return False
        
        # Prefer function names that match the filename
        clean_filename = filename.replace('-', '_').replace(' ', '_')
        clean_funcname = node.name.replace('-', '_').replace(' ', '_')
        
        if clean_funcname == clean_filename or clean_funcname in clean_filename:
            return True
            
        # Also accept if it has leetcode info (likely main problem)
        return 'leetcode' in docstring.lower()
    
    return False


def process_python_file(file_path: Path) -> List[Dict]:
    """Process a Python file and extract problem metadata."""
    problems = []
    
    try:
        # Read raw code (preserve docstrings)
        raw_text = file_path.read_text(encoding="utf-8")
        
        # Parse AST
        tree = ast.parse(raw_text)
        
        # Extract metadata from main problem functions/classes only
        for node in tree.body:  # Only top-level nodes, not nested
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                if is_main_problem_function(node, str(file_path)):
                    metadata = extract_problem_metadata(node, str(file_path))
                    if metadata:
                        problems.append(metadata)
                    
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
    
    return problems


def generate_categories(problems: List[Dict]) -> Dict[str, Dict[str, int]]:
    """Generate category counts for filtering."""
    categories = {
        "difficulties": {},
        "topics": {},
        "patterns": {}
    }
    
    for problem in problems:
        # Count difficulties
        if "difficulty" in problem:
            diff = problem["difficulty"]
            categories["difficulties"][diff] = categories["difficulties"].get(diff, 0) + 1
        
        # Count topics
        for topic in problem.get("topics", []):
            categories["topics"][topic] = categories["topics"].get(topic, 0) + 1
        
        # Count patterns  
        for pattern in problem.get("patterns", []):
            categories["patterns"][pattern] = categories["patterns"].get(pattern, 0) + 1
    
    return categories


def main() -> None:
    # Calculate paths relative to script location
    project_root = Path(__file__).resolve().parent.parent.parent.parent
    default_root = project_root / "backend" / "algorithms" / "new"
    default_output = project_root / "lib" / "extracted-metadata" / "navigation_metadata.json"
    
    parser = argparse.ArgumentParser(
        description="Generate navigation metadata from Python algorithm files."
    )
    parser.add_argument(
        "--root", 
        type=Path, 
        default=default_root,
        help=f"Root directory to scan for Python files (default: {default_root})"
    )
    parser.add_argument(
        "--out", 
        type=Path, 
        default=default_output,
        help=f"Output JSON file path (default: {default_output})"
    )
    
    args = parser.parse_args()
    
    if not args.root.exists():
        print(f"Error: Root directory {args.root} does not exist", file=sys.stderr)
        sys.exit(1)
    
    # Find all Python files
    python_files = [
        p for p in args.root.rglob("*.py") 
        if p.is_file() 
        and "__pycache__" not in p.parts 
        and not any(part.startswith(".") for part in p.parts)
    ]
    
    print(f"Found {len(python_files)} Python files to process")
    
    # Process all files
    all_problems = []
    
    for file_path in python_files:
        problems = process_python_file(file_path)
        all_problems.extend(problems)
        if problems:
            print(f"  {file_path.name}: {len(problems)} problems")
    
    # Generate categories for filtering
    categories = generate_categories(all_problems)
    
    # Create output structure
    output = {
        "problems": sorted(all_problems, key=lambda p: p["title"]),
        "categories": categories,
        "metadata": {
            "total_problems": len(all_problems),
            "total_files": len(python_files),
            "generated_at": "2025-01-15"  # Could use datetime.now().isoformat()
        }
    }
    
    # Ensure output directory exists
    args.out.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSON output with nice formatting
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False, sort_keys=True)
    
    print(f"\n✅ Wrote navigation metadata: {args.out}")
    print(f"Total: {len(all_problems)} problems from {len(python_files)} files")
    
    # Print category summary
    print(f"\nCategories:")
    print(f"  Difficulties: {dict(categories['difficulties'])}")
    print(f"  Topics: {len(categories['topics'])} unique")
    print(f"  Patterns: {len(categories['patterns'])} unique")


if __name__ == "__main__":
    main()