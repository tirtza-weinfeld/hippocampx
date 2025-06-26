import ast
import os
import json

def extract_metadata_from_file(filepath):
    with open(filepath, "r") as f:
        tree = ast.parse(f.read(), filename=filepath)
    result = {}
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
            doc = ast.get_docstring(node) or ""
            result[node.name] = {
                "type": type(node).__name__,
                "doc": doc,
                "file": filepath,
                "line": node.lineno,
            }
    return result

def extract_from_dir(directory):
    all_metadata = {}
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py") and not file.startswith("__"):
                path = os.path.join(root, file)
                all_metadata.update(extract_metadata_from_file(path))
    return all_metadata

if __name__ == "__main__":
    code_dir = os.path.join(os.path.dirname(__file__), "../code")
    metadata = extract_from_dir(code_dir)
    with open(os.path.join(os.path.dirname(__file__), "../python_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    print("Metadata extraction complete!")
