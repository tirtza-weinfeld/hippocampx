# Requirements for `extract_metadata` Script

## Description & Intention

This script is intended to automate the extraction of symbol metadata (functions, classes, methods) from source files (such as Python, TypeScript, etc.) in a codebase. The primary goal is to produce a standardized JSON file containing all relevant symbol information, which can then be used by frontend tools—such as the remark-code-tooltip plugin—to provide VS Code–like tooltips in MDX/React code blocks. The output enables language-agnostic, interactive code documentation.

---

## Purpose

Extract symbol metadata (functions, classes, methods) from source files (e.g., Python, TypeScript) and output a standardized JSON file for use by the remark-code-tooltip plugin.

---

## Features & Requirements

1. **Input Specification**
   - The script must accept as input:
     - The root directory to scan (e.g., `examples/code/`)
     - The file extension(s) or language(s) to process (e.g., `.py`, `.ts`)
     - (Optional) A list of files or patterns to include/exclude
   - The user should be able to specify these via command-line arguments or a config file.

2. **Extraction Targets**
   - For each supported language, the script must extract:
     - Symbol name (function, class, method)
     - Type (e.g., `function`, `class`, `method`)
     - Signature (function/class signature as a string)
     - **Parameters** (structured parameter information with types and descriptions)
     - **Return type** and return description (for functions/methods)
     - Description (first docstring content, cleaned of line numbers and file paths)
     - File path (relative to project root)
     - Line number (where the symbol is defined)
     - Language (e.g., `python`, `typescript`)
     - Code (clean code without comments or docstrings)
     - **Parent class** (for methods)

3. **Output Format**
   - The script must output a single JSON file (e.g., `lib/extrc/code_metadata.json`) with the following structure:

     ```json
     {
       "symbolName": {
         "name": "string (symbol name)",
         "type": "function" | "class" | "method",
         "language": "string (e.g., 'python', 'typescript')",
         "file": "string (relative file path)",
         "line": number,
         "signature": "string (function/class signature)",
         "parameters": [
           {
             "name": "string (parameter name)",
             "type": "string (parameter type annotation)",
             "description": "string (parameter description from docstring)",
             "default": "string | null (default value if any)"
           }
         ],
         "return_type": "string (return type annotation)",
         "return_description": "string (return value description from docstring)",
         "description": "string (clean description without line numbers/file paths)",
         "code": "string (clean code without comments or docstrings)",
         "parent": "string (parent class name, for methods only)"
       },
       ...
     }
     ```
   - The output must be valid JSON, ready to be consumed by the remark-code-tooltip plugin.

4. **Code Extraction Rules**
   - **Functions/Methods:** Full implementation without comments or docstrings
   - **Classes:** All method signatures without comments or docstrings
   - **Variables/Constants:** Not extracted (only functions, classes, methods)

5. **Parameter Extraction**
   - Parse function/method signatures to extract parameter names and type annotations
   - Extract parameter descriptions from docstring sections (e.g., `Args:` section)
   - Handle default values and optional parameters
   - Support complex type annotations (e.g., `list[int]`, `dict[str, Any]`)

6. **Return Type Extraction**
   - Extract return type annotations from function/method signatures
   - Parse return descriptions from docstring sections (e.g., `Returns:` section)
   - Handle multiple return types and conditional returns

7. **Docstring Parsing**
   - Parse structured docstrings to extract parameter and return descriptions
   - Support common docstring formats (Google, NumPy, reStructuredText)
   - Clean descriptions by removing line numbers and file paths
   - Preserve formatting and structure where appropriate

8. **Extensibility**
   - The script should be designed so that new language extractors can be added easily, as long as they output the same JSON schema.

9. **Error Handling**
   - If a file or symbol cannot be parsed, skip it and log a warning (do not crash the script).
   - Gracefully handle missing type annotations or incomplete docstrings.

10. **Performance**
    - The script should be able to process large codebases efficiently.

11. **Usage Example**
    - Example command:
      ```sh
      pnpm run extract-metadata --dirs examples/code/ lib/ --out=lib/extracted-metadata/code_metadata.json
      ```


---

## Enhanced Tooltip Features

The enhanced metadata enables tooltips to display:
- **Parameter details** with types, descriptions, and default values
- **Return type** and return value description
- **Better formatting** and organization in the tooltip UI
- **VS Code-like experience** with comprehensive symbol information
