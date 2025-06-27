# Requirements for `remark-smart-code-import.ts`

## Purpose

This plugin enables dynamic, robust code import into MDX code blocks from external files, supporting both line and function-based extraction, with optional docstring stripping and precise meta handling.

---

## Features & Requirements

1. **Dynamic Code Import by Reference**
   - MDX code blocks can import code from external files using a `file=...` meta attribute.
   - Supported forms:
     - **Line-based import:**
       ```python file=../../../../examples/code/prefix_sum.py#L5-L36 meta="example"
       ```
       - Imports lines 5–36 from the specified file.
     - **Function-based import:**
       ```python file=../../../../examples/code/prefix_sum.py#func:maxSubArrayLen meta="example"
       ```
       - Imports the function `maxSubArrayLen` from the specified file.

2. **Docstring Stripping**
   - If the `stripDocstring` flag is present in the meta, remove the first docstring from the imported function.
   - Example:
     ```python file=../../../../examples/code/prefix_sum.py#func:maxSubArrayLen stripDocstring meta="example"
     ```
     - Imports the function and removes its docstring.

3. **Meta Attribute Handling**
   - Extraction-specific attributes (`file=...`, `#Lx-Ly`, `#func:...`, `stripDocstring`) are **removed** from the final code block's meta.
   - All other meta attributes (e.g., `meta="example"`) are **preserved and passed down** to the final code block.
   - **Example:**
     - Input:  
       ```python file=../../../../examples/code/prefix_sum.py#func:maxSubArrayLen stripDocstring meta="examplemeta"
       ```
     - Output code block meta:  
       ```python meta="examplemeta"
            the extracted maxSubArrayLen code
       ```     

4. **Language Preservation**
   - The language specified in the code block (e.g., `python`) is preserved.

5. **Robust Extraction**
   - For function-based import, extract the function by name, supporting both top-level and indented (class) functions.
   - For line-based import, extract the exact lines specified.

6. **Modern, Type-Safe Implementation**
   - Never use `any`.
   - Never define types for entities that should be imported from a package—always import types from the canonical, modern package if they exist.
   - If a type is not available from a package, do not define it yourself—pause and ask for direction.

7. **Error Handling**
   - If the file or function is not found, fail gracefully (do not crash the build).

8. **Compatibility**
   - The plugin must work with the latest Next.js, MDX, and remark/unified ecosystem (canary/modern as of June/July 2025).

