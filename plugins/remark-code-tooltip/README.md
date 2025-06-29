# Requirements for `remark-code-tooltip` Plugin

## Description & Intention

This plugin enables VS Code–like tooltips for code symbols (functions, classes, methods, etc.) in MDX/React code blocks, using standardized symbol metadata extracted from any language. The metadata is produced by the `extract_metadata` script and consumed by this plugin to provide interactive, language-agnostic code documentation.

---

## Purpose

Render interactive, accessible tooltips for code symbols in code blocks, using a standardized JSON metadata file as input.

---

## Features & Requirements

1. **Metadata Input**
   - The plugin expects a JSON file (e.g., `public/code_metadata.json`) containing symbol metadata for all supported languages.
   - The JSON must be a flat object where each key is a unique symbol identifier (e.g., function, class, or method name), and each value is an object with the following fields (matching the output of `extract_metadata`):

     ```json
     {
       "symbolName": {
         "name": "string (symbol name)",
         "type": "function" | "class" | "method",
         "language": "string (e.g., 'python', 'typescript')",
         "file": "string (relative file path)",
         "line": number,
         "signature": "string (function/class signature)",
         "description": "string (clean description without line numbers/file paths)",
         "code": "string (clean code without comments/docstrings)"
       }
     }
     ```

   - The plugin must support loading this JSON at build time or runtime.

2. **Tooltip Rendering**
   - When rendering code blocks, the plugin scans for symbol names (functions, classes, methods).
   - For each symbol found, if metadata exists, wrap it in a tooltip-enabled component.
   - On click/tap show a tooltip with:
     - The symbol's signature (`signature`)
     - The description/documentation (`description`)

3. **Language Support**
   - The plugin must support multiple languages, as long as the metadata follows the specified format.
   - The `language` field in the metadata can be used to disambiguate symbols with the same name in different languages.

4. **Accessibility**
   - Tooltips must be accessible (keyboard and screen reader friendly).
   - Tooltips must work on both desktop and mobile.

5. **Performance**
   - Metadata loading and tooltip rendering must be performant, even for large codebases.

6. **Error Handling**
   - If metadata is missing for a symbol, fail gracefully (show no tooltip or a fallfall message).

7. **Compatibility**
   - The plugin must work with the latest Next.js, MDX, and React ecosystem (canary/modern as of June/July 2025).

---

## Usage Example

- Place the output JSON from `extract_metadata` (e.g., `public/code_metadata.json`) in your public directory.
- The plugin will automatically load this file and use it to power tooltips in code blocks.
