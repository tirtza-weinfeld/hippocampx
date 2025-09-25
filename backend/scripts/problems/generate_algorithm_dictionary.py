# #!/usr/bin/env python3
# """
# Generate algorithm dictionary metadata for the algorithms dictionary component.

# Output JSON shape:
# {
#   "algorithms": {
#     "algorithm_name": {
#       "name": "algorithm_name",
#       "title": "Algorithm Display Name", 
#       "summary": "Brief description",
#       "complexity": {
#         "time": "O(log n)",
#         "space": "O(1)", 
#         "explanation": "Optional detailed explanation"
#       },
#       "topics": ["searching", "divide-conquer"],
#       "difficulty": "beginner|intermediate|advanced|expert",
#       "leetcode": {
#         "problem": "704. Binary Search",
#         "url": "https://leetcode.com/problems/binary-search/"
#       },
#       "related": ["binary_search_left", "binary_search_right"],
#       "prerequisites": ["arrays", "recursion"],
#       "intuition": "Why/when to use this algorithm",
#       "applications": ["database-search", "optimization"]
#     }
#   }
# }

# Focus: Only fields needed for the dictionary UI - no AST ranges, positions, or LSP metadata.
# """

# import argparse
# import ast
# import json
# import sys
# from pathlib import Path
# from typing import Dict, List, Optional, Union

# # Add the current directory to Python path to import code_cleaner
# sys.path.insert(0, str(Path(__file__).parent))
# from code_cleaner import clean_code


# def _parse_complexity(text: str) -> Optional[Dict[str, str]]:
#     """Parse complexity information from docstring text."""
#     if not text.strip():
#         return None
    
#     complexity = {}
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     for line in lines:
#         line_lower = line.lower()
#         if line_lower.startswith('time:'):
#             time_part = line[5:].strip()
#             if ' - ' in time_part:
#                 time_val, time_exp = time_part.split(' - ', 1)
#                 complexity['time'] = time_val.strip()
#                 if 'explanation' not in complexity:
#                     complexity['explanation'] = time_exp.strip()
#             else:
#                 complexity['time'] = time_part
#         elif line_lower.startswith('space:'):
#             space_part = line[6:].strip()
#             if ' - ' in space_part:
#                 space_val, space_exp = space_part.split(' - ', 1)
#                 complexity['space'] = space_val.strip()
#                 if 'explanation' not in complexity:
#                     complexity['explanation'] = space_exp.strip()
#                 else:
#                     complexity['explanation'] += f" Space: {space_exp.strip()}"
#             else:
#                 complexity['space'] = space_part
    
#     return complexity if complexity else None


# def _parse_leetcode(text: str) -> Optional[Dict[str, str]]:
#     """Parse LeetCode info from '[problem](url)' markdown format or 'problem | url' format."""
#     if not text.strip():
#         return None
    
#     text = text.strip()
#     # Match markdown link format: [problem](url)
#     import re
#     match = re.search(r'\[([^\]]+)\]\(([^)]+)\)', text)
#     if match:
#         problem, url = match.groups()
#         return {"problem": problem.strip(), "url": url.strip()}
#     elif ' | ' in text:
#         problem, url = text.split(' | ', 1)
#         return {"problem": problem.strip(), "url": url.strip()}
#     else:
#         return {"problem": text}


# def _parse_list_field(text: str) -> List[str]:
#     """Parse comma-separated list from text."""
#     if not text.strip():
#         return []
#     # Handle both comma and newline separation
#     items = []
#     for line in text.split('\n'):
#         line = line.strip()
#         if line:
#             if ',' in line:
#                 items.extend([item.strip() for item in line.split(',') if item.strip()])
#             else:
#                 items.append(line)
#     return items


# def _extract_algorithm_metadata(node: ast.FunctionDef, file_path: str = "") -> Optional[Dict[str, Union[str, Dict, List]]]:
#     """Extract algorithm metadata from function docstring."""
#     docstring = ast.get_docstring(node, clean=True)
#     if not docstring:
#         # Check if there's a string literal as first statement
#         if (node.body and isinstance(node.body[0], ast.Expr) 
#             and isinstance(node.body[0].value, ast.Constant) 
#             and isinstance(node.body[0].value.value, str)):
#             docstring = node.body[0].value.value
#             print(f"Found docstring manually for: {node.name}")
#         else:
#             print(f"No docstring for function: {node.name} in {file_path}")
#             return None
    
#     # Initialize result with function name
#     result = {
#         "name": node.name,
#         "title": node.name.replace('_', ' ').title()  # Default title
#     }
    
#     lines = [ln.rstrip() for ln in docstring.splitlines()]
#     sections = {
#         "summary": [],
#         "complexity": [],
#         "topics": [],
#         "difficulty": [],
#         "leetcode": [],
#         "related": [],
#         "prerequisites": [],
#         "intuition": [],
#         "applications": []
#     }
    
#     current_section = "summary"
    
#     for line in lines:
#         line_stripped = line.strip()
        
#         # Check for section headers - handle actual format with indentation
#         section_found = None
#         line_clean = line_stripped.lower()
        
#         if line_clean.startswith('title:') or line_clean.endswith('title:'):
#             # Extract title for display name
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 result["title"] = content
#         elif line_clean.startswith('definition:') or line_clean.endswith('definition:'):
#             current_section = "summary"
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 sections[current_section].append(content)
#         elif line_clean.startswith('topics:') or line_clean.endswith('topics:'):
#             section_found = "topics"
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 sections[section_found].append(content)
#         elif line_clean.startswith('difficulty:') or line_clean.endswith('difficulty:'):
#             section_found = "difficulty"  
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 sections[section_found].append(content)
#         elif line_clean.startswith('leetcode:') or line_clean.endswith('leetcode:'):
#             section_found = "leetcode"
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 sections[section_found].append(content)
#         elif line_clean.startswith('intuition:') or line_clean.endswith('intuition:'):
#             section_found = "intuition"
#             content = line_stripped.split(':', 1)[1].strip() if ':' in line_stripped else ''
#             if content:
#                 sections[section_found].append(content)
#         elif line_stripped.lower().startswith('time complexity:'):
#             section_found = "complexity"
#             content = line_stripped[16:].strip()
#             if content:
#                 sections[section_found].append(f"Time: {content}")
#         elif line_stripped.lower().startswith('space complexity:'):
#             section_found = "complexity"
#             content = line_stripped[17:].strip()
#             if content:
#                 sections[section_found].append(f"Space: {content}")
#         elif line_stripped.lower().startswith(('related:', 'related algorithms:')):
#             section_found = "related"
#             prefix_len = 8 if line_stripped.lower().startswith('related:') else 19
#             content = line_stripped[prefix_len:].strip()
#             if content:
#                 sections[section_found].append(content)
#         elif line_stripped.lower().startswith('applications:'):
#             section_found = "applications"
#             content = line_stripped[13:].strip()
#             if content:
#                 sections[section_found].append(content)
        
#         if section_found:
#             current_section = section_found
#         else:
#             sections[current_section].append(line)
    
#     # Process sections into final metadata
#     summary_text = '\n'.join(sections["summary"]).strip()
#     if summary_text:
#         result["summary"] = summary_text
    
#     # Complexity
#     complexity_text = '\n'.join(sections["complexity"]).strip()
#     complexity = _parse_complexity(complexity_text)
#     if complexity:
#         result["complexity"] = complexity
    
#     # Topics
#     topics_text = ' '.join(sections["topics"]).strip()
#     topics = _parse_list_field(topics_text)
#     if topics:
#         result["topics"] = topics
    
#     # Difficulty - map common terms
#     difficulty_text = ' '.join(sections["difficulty"]).strip().lower()
#     difficulty_map = {
#         'easy': 'beginner',
#         'medium': 'intermediate',
#         'hard': 'advanced',
#         'expert': 'expert',
#         'beginner': 'beginner',
#         'intermediate': 'intermediate', 
#         'advanced': 'advanced'
#     }
#     if difficulty_text in difficulty_map:
#         result["difficulty"] = difficulty_map[difficulty_text]
    
#     # LeetCode
#     leetcode_text = ' '.join(sections["leetcode"]).strip()
#     leetcode = _parse_leetcode(leetcode_text)
#     if leetcode:
#         result["leetcode"] = leetcode
    
#     # Related algorithms
#     related_text = ' '.join(sections["related"]).strip()
#     related = _parse_list_field(related_text)
#     if related:
#         result["related"] = related
    
#     # Prerequisites
#     prereq_text = ' '.join(sections["prerequisites"]).strip()
#     prerequisites = _parse_list_field(prereq_text)
#     if prerequisites:
#         result["prerequisites"] = prerequisites
    
#     # Intuition
#     intuition_text = '\n'.join(sections["intuition"]).strip()
#     if intuition_text:
#         result["intuition"] = intuition_text
    
#     # Applications
#     applications_text = ' '.join(sections["applications"]).strip()
#     applications = _parse_list_field(applications_text)
#     if applications:
#         result["applications"] = applications
    
#     return result


# def process_python_file(file_path: Path) -> Dict[str, Dict]:
#     """Process a Python file and extract algorithm metadata."""
#     algorithms = {}
    
#     try:
#         # Read the raw code (don't clean - we need docstrings!)
#         raw_text = file_path.read_text(encoding="utf-8")
        
#         # Parse AST
#         tree = ast.parse(raw_text)
        
#         # Extract function metadata
#         for node in ast.walk(tree):
#             if isinstance(node, ast.FunctionDef):
#                 metadata = _extract_algorithm_metadata(node, str(file_path))
#                 if metadata:
#                     algorithms[node.name] = metadata
                    
#     except Exception as e:
#         print(f"Error processing {file_path}: {e}", file=sys.stderr)
    
#     return algorithms


# def iter_python_files(root: Path) -> List[Path]:
#     """Find all Python files in the directory tree."""
#     return [
#         p for p in root.rglob("*.py") 
#         if p.is_file() 
#         and "__pycache__" not in p.parts 
#         and not any(part.startswith(".") for part in p.parts)
#     ]


# def main() -> None:
#     # Calculate project root relative to script location
#     project_root = Path(__file__).resolve().parent.parent.parent.parent
#     default_root = project_root / "backend" / "algorithms" / "new"
#     default_output = project_root / "lib" / "extracted-metadata" / "algorithm_dictionary.json"
    
#     parser = argparse.ArgumentParser(
#         description="Generate algorithm dictionary metadata from Python files."
#     )
#     parser.add_argument(
#         "--root", 
#         type=Path, 
#         default=default_root,
#         help=f"Root directory to scan for Python files (default: {default_root})"
#     )
#     parser.add_argument(
#         "--out", 
#         type=Path, 
#         default=default_output,
#         help=f"Output JSON file path (default: {default_output})"
#     )
    
#     args = parser.parse_args()
    
#     if not args.root.exists():
#         print(f"Error: Root directory {args.root} does not exist", file=sys.stderr)
#         sys.exit(1)
    
#     # Find all Python files
#     python_files = iter_python_files(args.root)
#     print(f"Found {len(python_files)} Python files to process")
    
#     # Process all files
#     all_algorithms = {}
#     total_algorithms = 0
    
#     for file_path in python_files:
#         algorithms = process_python_file(file_path)
#         all_algorithms.update(algorithms)
#         total_algorithms += len(algorithms)
#         if algorithms:
#             print(f"  {file_path.name}: {len(algorithms)} algorithms")
    
#     # Create output structure
#     output = {
#         "algorithms": all_algorithms,
#         "metadata": {
#             "generated_at": "2025-01-15",  # You could use datetime.now().isoformat()
#             "total_algorithms": total_algorithms,
#             "total_files": len(python_files)
#         }
#     }
    
#     # Ensure output directory exists
#     args.out.parent.mkdir(parents=True, exist_ok=True)
    
#     # Write JSON output with nice formatting
#     with open(args.out, 'w', encoding='utf-8') as f:
#         json.dump(output, f, indent=2, ensure_ascii=False, sort_keys=True)
    
#     print(f"\nWrote {args.out}")
#     print(f"Total: {total_algorithms} algorithms from {len(python_files)} files")


# if __name__ == "__main__":
#     main()