# MDX Problem Generator Script Requirements

## Overview
Generate MDX files for LeetCode problems from extracted metadata (`problems_metadata.json`), creating interactive problem cards with multiple solution approaches.

---

## Input Source
- **Metadata file**: `lib/extracted-metadata/problems_metadata.json`
- **Data structure**: `problems_metadata.json['problems'][problem_id]`
- **Process**: All problems in the `problems` object

---

## Output Structure

### File Location & Naming
- **Output directory**: `components/problems/tcards/`
- **Filename pattern**: `{problem-id}.mdx`
- **Example**: `347-top-k-frequent-elements.mdx`

---

## MDX Template Structure

### 1. Header Section
```mdx

## [!collapsible:expand] {title}
```

**Data mapping**:
- `{title}`: From `metadata['title']` (extracted from `__init__.py`)

---

### 2. ProblemCardCallout Wrapper
```jsx
<ProblemCardCallout file="{default_file}">
```

**Rules for `{default_file}`**:
1. **If `group` field exists**: Use first file from first group
   - Example: `group: [["heap.py", "heap-nlargest.py"], ["sort-frequency-bucketing.py"]]` → `"heap.py"`
2. **If no `group` field**: Use first file from `solutions` dictionary keys
3. **Single solution**: Use that solution's filename

---

### 3. ProblemCardFabGroup
```jsx
<ProblemCardFabGroup>
  <ProblemCardCalloutFabButton tab="definition" />
  <ProblemCardCalloutFabButton tab="intuition" />
  <ProblemCardCalloutFabButton tab="timeComplexity" />
  <ProblemCardCalloutFabButton tab="keyVariables" files={new Set(["heap.py"])} />
  <ProblemCardCalloutFabButton tab="keyExpressions" />
</ProblemCardFabGroup>
```

**Button Generation Logic**:

| Tab Name | Show Condition | `files` Attribute |
|----------|---------------|-------------------|
| `definition` | Always | Never include |
| `intuition` | Any solution has `intuition` field | Include if **not all** solutions have intuition |
| `timeComplexity` | Any solution has `time_complexity` field | Never include (all solutions should have) |
| `keyVariables` | Any solution has `variables` field | Include if **not all** solutions have variables |
| `keyExpressions` | Any solution has `expressions` field | Include if **not all** solutions have expressions |

**`files` Attribute Rules**:
- **Omit entirely** when: Button should appear for ALL files
- **Include `files={new Set([...])}`** when: Only specific files have this metadata
  - Value: Set containing filenames that have this metadata type
  - Example: `files={new Set(["heap.py", "heap-nlargest.py"])}`

---

### 4. ProblemCardCalloutDialog

#### 4a. Definition Tab (Problem-level)
```jsx
<ProblemCardCalloutTab tab="definition">
{definition_content}
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['definition']`
- **NO `file` attribute** (shared across all solutions)
- **Always generated**

---

#### 4b. Intuition Tab (Optional, Solution-level)
```jsx
<ProblemCardCalloutTab tab="intuition" file="{filename}">
{intuition_content}
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['solutions'][filename]['intuition']`
- **Generation rules**:
  - Only generate if solution has `intuition` field
  - Include `file` attribute if multiple solutions exist
  - Omit `file` attribute if only one solution
- **Generate**: One tab per solution that has intuition

---

#### 4c. Time Complexity Tabs (Solution-level)
```jsx
<ProblemCardCalloutTab tab="timeComplexity" file="heap.py">
- $O(n \log k)$:
    - Counter(nums) → $O(n)$
    - heapq.heappush(h, (f, num)) → $O(\log k)$
</ProblemCardCalloutTab>
<ProblemCardCalloutTab tab="timeComplexity" file="heap-nlargest.py">
$O(n \log k)$
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['solutions'][filename]['time_complexity']`
- **Always include `file` attribute** (solution-specific)
- **Generate**: One tab per solution file
- **Content**: Use as-is from metadata (already formatted)

---

#### 4d. Space Complexity Tabs (Optional, Solution-level)
```jsx
<ProblemCardCalloutTab tab="spaceComplexity" file="{filename}">
{space_complexity_content}
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['solutions'][filename]['space_complexity']`
- **Only generate if** solution has `space_complexity` field
- **Include `file` attribute**

---

#### 4e. Key Variables Tabs (Optional, Solution-level)
```jsx
<ProblemCardCalloutTab tab="keyVariables" file="heap.py">
- `freq`: the frequency of the numbers
- `h`: the heap
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['solutions'][filename]['variables']` (dictionary)
- **Format conversion**:
  ```python
  # Input: {"freq": "the frequency of the numbers", "h": "the heap"}
  # Output:
  # - `freq`: the frequency of the numbers
  # - `h`: the heap
  ```
- **Include `file` attribute**
- **Only generate if** solution has `variables` field

---

#### 4f. Key Expressions Tabs (Optional, Solution-level)
```jsx
<ProblemCardCalloutTab tab="keyExpressions" file="heap.py">
- `heapq.heappush(h, (f, num))`: push the frequency and number into the heap
</ProblemCardCalloutTab>
<ProblemCardCalloutTab tab="keyExpressions" file="heap-nlargest.py">
- `freq.keys()`: iterable → here freq.keys(), i.e. all unique numbers.
- `key=freq.get`: key → function that gives a value to rank by. freq.get(x) = frequency of x.
</ProblemCardCalloutTab>
```

**Data mapping**:
- **Source**: `metadata['solutions'][filename]['expressions']` (dictionary)
- **Format conversion**:
  ```python
  # Input: {"heapq.heappush(h, (f, num))": "push the frequency and number into the heap"}
  # Output:
  # - `heapq.heappush(h, (f, num))`: push the frequency and number into the heap
  ```
- **Include `file` attribute**
- **Only generate if** solution has `expressions` field

---

### 5. ProblemFileList (Only for Multiple Solutions)
```jsx
<ProblemFileList>
  <ProblemFileTrigger file="heap.py" />
  <ProblemFileTrigger file="heap-nlargest.py" />
  <ProblemFileTrigger file="sort-frequency-bucketing.py" />
</ProblemFileList>
```

**Generation rules**:
- **ONLY generate if**: Problem has multiple solution files (2+)
- **SKIP entirely if**: Problem has single solution
- Generate one `<ProblemFileTrigger />` per solution file
- **Order**: Maintain order from `metadata['solutions']` dictionary keys
- **`file` attribute**: Solution filename (required)

---

### 6. ProblemCardCalloutCodeSnippet
```jsx
<ProblemCardCalloutCodeSnippet file="heap.py">
```python meta="source=problems/347-top-k-frequent-elements/heap.py"
import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    freq ,h= Counter(nums), []
    for num, f in freq.items():
        heapq.heappush(h, (f, num))
        if len(h) > k:
            heapq.heappop(h)

    return [num for _, num in h]
```
</ProblemCardCalloutCodeSnippet>
```

**Data mapping**:
- **Generate**: One snippet per solution file
- **`file` attribute**: Solution filename (e.g., `"heap.py"`)
- **`meta` attribute**: `source=problems/{problem-id}/{filename}`
  - Example: `source=problems/347-top-k-frequent-elements/heap.py`
- **Code content**: `metadata['solutions'][filename]['code']`
  - Already cleaned by `extract_problems_metadata.py` (docstrings removed)
- **Language**: `python` (hardcoded for now)

---

### 7. Closing Tag
```jsx
</ProblemCardCallout>
```

---

## Data Structure Reference

### Problem Metadata Structure
```json
{
  "347-top-k-frequent-elements": {
    "title": "Top K Frequent Elements",
    "definition": "Given an integer array `nums` and an integer `k`, return the `k` most **frequent** elements...",
    "leetcode": "https://leetcode.com/problems/top-k-frequent-elements",
    "difficulty": "medium",
    "topics": ["heap", "min-heap"],
    "group": [
      ["heap.py", "heap-nlargest.py"],
      ["sort-frequency-bucketing.py"]
    ],
    "time_stamps": {
      "created": "2024-10-01T12:00:00Z",
      "updated": "2024-10-17T16:44:00Z"
    },
    "solutions": {
      "heap.py": {
        "time_complexity": "O(n log k): ...",
        "variables": {
          "freq": "the frequency of the numbers",
          "h": "the heap"
        },
        "expressions": {
          "heapq.heappush(h, (f, num))": "push the frequency and number into the heap"
        },
        "code": "import heapq\nfrom collections import Counter\n\ndef topKFrequent..."
      },
      "heap-nlargest.py": {
        "time_complexity": "O(n log k)",
        "variables": {
          "freq": "Counter object"
        },
        "expressions": {
          "freq.keys()": "iterable → here freq.keys(), i.e. all unique numbers.",
          "key=freq.get": "key → function that gives a value to rank by. freq.get(x) = frequency of x."
        },
        "code": "import heapq\n..."
      },
      "sort-frequency-bucketing.py": {
        "time_complexity": "O(n): ...",
        "expressions": {
          "bucket[f].append(n)": "append n to the bucket with frequency f"
        },
        "code": "from collections import Counter\n..."
      }
    }
  }
}
```

---

## Edge Cases & Special Handling

### Case 1: Single Solution Problem
**Example**: Koko Eating Bananas (only one solution file)

**Rules**:
- **Omit `file` attribute** from:
  - `<ProblemCardCallout>` wrapper (component defaults to empty string)
  - All `<ProblemCardCalloutTab>` elements (will match any file)
- **Keep `file` attribute** on:
  - `<ProblemCardCalloutCodeSnippet>` (still required for proper rendering)
- **No `files` attribute** on any `ProblemCardCalloutFabButton`
- **CRITICAL: Omit `<ProblemFileList>` entirely** - no file navigation needed
- **Simplified structure**: Treat metadata as problem-level

**Component Updates** (already implemented):
- `ProblemCardCallout`: `file` prop is now optional (defaults to `''`)
- `ProblemCardCalloutTab`: `file` prop is now optional (visibility logic: `!file || file === activeFile`)

**Example**:
```jsx
<ProblemCardCallout>
<!-- No file attribute -->

<ProblemCardCalloutTab tab="intuition">
<!-- No file attribute -->
</ProblemCardCalloutTab>

<ProblemCardCalloutTab tab="timeComplexity">
<!-- No file attribute -->
</ProblemCardCalloutTab>

<!-- NO ProblemFileList section -->

<ProblemCardCalloutCodeSnippet file="koko-eating-bananas.py">
<!-- Still needs file attribute -->
</ProblemCardCalloutCodeSnippet>

</ProblemCardCallout>
```

---

### Case 2: Missing Optional Metadata
**Scenarios**:
- No `intuition` field in any solution
- Some solutions missing `variables`
- Some solutions missing `expressions`

**Rules**:
- **Don't generate button** if NO solutions have that metadata type
- **Use `files` attribute** if SOME (but not all) solutions have that metadata type
- **Example**:
  ```jsx
  <!-- Only heap.py has variables -->
  <ProblemCardCalloutFabButton tab="keyVariables" files={new Set(["heap.py"])} />

  <!-- No solutions have intuition - omit button entirely -->
  {/* <ProblemCardCalloutFabButton tab="intuition" /> */}
  ```

---

### Case 3: Empty or Missing `group` Field
**Rules**:
- **Fallback**: Use order from `solutions` dictionary keys
- **Default file**: First solution in `solutions` dictionary

---

### Case 4: Multi-line Expressions/Variables
**From metadata**:
```json
{
  "expressions": {
    "'freq.keys()' : iterable → here freq.keys(), i.e. all unique numbers.\n'key=freq.get' : key → function that gives a value to rank by. freq.get(x) = frequency of x."
  }
}
```

**Output**:
```mdx
- `freq.keys()` : iterable → here freq.keys(), i.e. all unique numbers.
- `key=freq.get` : key → function that gives a value to rank by. freq.get(x) = frequency of x.
```

**Handling**: Already formatted in metadata, use as-is

---

## Script Implementation Requirements

### Required Functions

```python
def generate_mdx_from_metadata(problem_id: str, metadata: dict) -> str:
    """
    Generate complete MDX content for a problem.

    Args:
        problem_id: Problem directory name (e.g., "347-top-k-frequent-elements")
        metadata: Problem metadata from problems_metadata.json

    Returns:
        Complete MDX file content as string
    """
    pass

def determine_default_file(metadata: dict) -> str:
    """
    Determine which file should be the default based on group/solutions.

    Args:
        metadata: Problem metadata containing 'group' and 'solutions'

    Returns:
        Filename to use as default (e.g., "heap.py")
    """
    pass

def generate_fab_group(solutions: dict) -> str:
    """
    Generate ProblemCardFabGroup with conditional buttons.

    Args:
        solutions: Dictionary of solution metadata

    Returns:
        MDX string for ProblemCardFabGroup component
    """
    pass

def generate_dialog_tabs(problem_metadata: dict, solutions: dict) -> str:
    """
    Generate all ProblemCardCalloutTab elements.

    Args:
        problem_metadata: Problem-level metadata (definition, etc.)
        solutions: Dictionary of solution metadata

    Returns:
        MDX string for all tabs within ProblemCardCalloutDialog
    """
    pass

def generate_file_list(solution_files: list[str]) -> str:
    """
    Generate ProblemFileList with ProblemFileTrigger elements.

    Args:
        solution_files: List of solution filenames

    Returns:
        MDX string for ProblemFileList component
    """
    pass

def generate_code_snippets(problem_id: str, solutions: dict) -> str:
    """
    Generate all ProblemCardCalloutCodeSnippet elements.

    Args:
        problem_id: Problem directory name for meta source path
        solutions: Dictionary of solution metadata with 'code' field

    Returns:
        MDX string for all code snippets
    """
    pass

def format_dict_to_markdown_list(data: dict, key_backticks: bool = True) -> str:
    """
    Convert dictionary to markdown list format.

    Args:
        data: Dictionary to convert
        key_backticks: Whether to wrap keys in backticks

    Returns:
        Markdown list string

    Example:
        {"freq": "frequency", "h": "heap"}
        -> "- `freq`: frequency\n- `h`: heap"
    """
    pass

def get_files_with_metadata(solutions: dict, field_name: str) -> set[str]:
    """
    Get set of filenames that have a specific metadata field.

    Args:
        solutions: Dictionary of solution metadata
        field_name: Name of field to check (e.g., 'variables', 'expressions')

    Returns:
        Set of filenames that contain the field
    """
    pass
```

---

### Script Execution Flow

1. **Load metadata**:
   ```python
   with open('lib/extracted-metadata/problems_metadata.json', 'r') as f:
       data = json.load(f)
   problems = data['problems']
   ```

2. **For each problem**:
   - Validate required fields (`title`, `definition`, `solutions`)
   - Generate MDX content using template
   - Write to `components/problems/tutorials/{problem_id}.mdx`

3. **Output summary**:
   - Count of generated files
   - List of skipped problems (with reasons)

---

## Validation Requirements

### Before Generation
- **Required fields**: `title`, `definition`
- **At least one solution** with `code` field
- **Valid `group` structure** (if present): List of lists of strings

### After Generation
- **File created** at expected path
- **Valid MDX syntax** (proper component nesting)
- **All solution files** have corresponding triggers and code snippets
- **Consistent ordering** across FileList, Tabs, and CodeSnippets

---

## Output Quality Requirements

1. **Indentation**:
   - 2 spaces per level
   - Match reference MDX formatting exactly

2. **Escaping**:
   - Backticks in code: Already handled in metadata
   - Quotes in descriptions: Escape if needed for JSX

3. **Whitespace**:
   - Single blank line between major sections
   - No trailing whitespace
   - Consistent line breaks in component props

4. **Comments**:
   - Add JSX comments for omitted optional sections
   - Example: `{/* No intuition provided for this problem */}`

5. **Error handling**:
   - Skip problems with missing required fields
   - Log warnings for missing optional fields
   - Continue processing other problems on individual failures

---

## Success Criteria

- ✅ Generates valid MDX for all problems with complete metadata
- ✅ Handles single-solution and multi-solution problems correctly
- ✅ Conditionally includes/omits optional metadata sections
- ✅ Properly uses `file` and `files` attributes based on data structure
- ✅ Maintains consistent formatting with reference MDX
- ✅ Provides clear logging of generated/skipped files
