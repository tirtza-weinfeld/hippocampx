#!/usr/bin/env python3
# generate_uses.py — build uses.json with import-aware qnames; skip annotations (Python 3.13+)

import argparse, ast, json, sys
from dataclasses import dataclass
from pathlib import Path

# Add the current directory to Python path to import code_cleaner
sys.path.insert(0, str(Path(__file__).parent))
from code_cleaner import clean_code

# ---------- LSP range ----------
def lsp_range(n: ast.AST) -> dict:
    return {
        "start": {"line": n.lineno - 1, "character": n.col_offset},
        "end":   {"line": getattr(n, "end_lineno", n.lineno) - 1,
                  "character": getattr(n, "end_col_offset", n.col_offset)},
    }

def name_range(node: ast.AST) -> dict:
    """Calculate the range for just the name/identifier part of a node"""
    if isinstance(node, ast.Name):
        # For Name nodes, the name range is the same as the full range
        return lsp_range(node)
    elif isinstance(node, ast.Attribute):
        # For Attribute nodes, name range covers just the attribute name
        attr_len = len(node.attr)
        end_char = getattr(node, "end_col_offset", node.col_offset)
        start_char = end_char - attr_len
        return {
            "start": {"line": getattr(node, "end_lineno", node.lineno) - 1, "character": start_char},
            "end": {"line": getattr(node, "end_lineno", node.lineno) - 1, "character": end_char},
        }
    elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        # For function definitions, skip "def " or "async def " to get just the name
        name_len = len(node.name)
        # Calculate where the name starts after "def " (4 chars) or "async def " (10 chars)
        if isinstance(node, ast.AsyncFunctionDef):
            name_start = node.col_offset + 10  # "async def "
        else:
            name_start = node.col_offset + 4   # "def "
        return {
            "start": {"line": node.lineno - 1, "character": name_start},
            "end": {"line": node.lineno - 1, "character": name_start + name_len},
        }
    elif isinstance(node, ast.ClassDef):
        # For class definitions, skip "class " to get just the name  
        name_len = len(node.name)
        name_start = node.col_offset + 6  # "class "
        return {
            "start": {"line": node.lineno - 1, "character": name_start},
            "end": {"line": node.lineno - 1, "character": name_start + name_len},
        }
    elif isinstance(node, ast.arg):
        # For function arguments, just the parameter name (not the type annotation)
        name_len = len(node.arg)
        return {
            "start": {"line": node.lineno - 1, "character": node.col_offset},
            "end": {"line": node.lineno - 1, "character": node.col_offset + name_len},
        }
    else:
        # Fallback: use full range
        return lsp_range(node)

# ---------- Bindings ----------
@dataclass
class ImportModule:  # import utils as u  -> u
    mod: str

@dataclass
class ImportSymbol:  # from utils import add as plus -> plus
    mod: str
    sym: str

@dataclass
class LocalDef:      # def/class/assigned name in this file
    qname: str
    kind: str | None = None

Binding = ImportModule | ImportSymbol | LocalDef

class Scope:
    def __init__(self, module: str, qual: list[str] | None = None, is_class: bool = False, is_comprehension: bool = False):
        self.module, self.qual = module, (qual or [])
        self.bind: dict[str, Binding] = {}
        self.is_class = is_class
        self.is_comprehension = is_comprehension
        self.instance_vars: dict[str, str] = {}  # Track self.x instance variables
    def q_of(self, name: str) -> str:
        return f"{self.module}:{'.'.join(self.qual + [name]) if self.qual else name}"

# ---------- Resolver ----------
class Uses(ast.NodeVisitor):
    def __init__(self, modname: str):
        self.mod = modname
        self.scopes: list[Scope] = [Scope(modname)]
        self.uses: list[dict] = []
        self.sys_path_additions: list[str] = []  # Track dynamic sys.path additions

    # scope helpers
    @property
    def cur(self) -> Scope: return self.scopes[-1]
    def push(self, name: str | None = None, is_class: bool = False, is_comprehension: bool = False):
        self.scopes.append(Scope(self.mod, self.cur.qual + ([name] if name else []), is_class, is_comprehension))
    def pop(self): self.scopes.pop()
    def define(self, name: str, b: Binding): self.cur.bind[name] = b

    # resolution
    def resolve_name(self, name: str) -> str | None:
        for s in reversed(self.scopes):
            b = s.bind.get(name)
            if isinstance(b, LocalDef):     return b.qname
            if isinstance(b, ImportSymbol): return f"{b.mod}:{b.sym}"
            if isinstance(b, ImportModule): return f"{b.mod}:"
        
        # Check if it's a built-in function
        if name in __builtins__ if isinstance(__builtins__, dict) else hasattr(__builtins__, name):
            return f"builtins:{name}"
        
        return self.cur.q_of(name)  # fallback: treat as local

    def resolve_attr_chain(self, node: ast.AST) -> str | None:
        # node is Attribute(...); peel to base
        parts: list[str] = []
        cur = node
        while isinstance(cur, ast.Attribute):
            parts.append(cur.attr)
            cur = cur.value
        if isinstance(cur, ast.Name):
            # Handle self.x access - look up in class instance_vars
            if cur.id == "self" and parts:
                attr_name = parts[-1]  # The attribute being accessed (e.g., "root" in self.root)
                for scope in reversed(self.scopes):
                    if scope.is_class and attr_name in scope.instance_vars:
                        return scope.instance_vars[attr_name]

            base_q = self.resolve_name(cur.id)
            if base_q is None: return None
            if base_q.endswith(":"):                # module
                return f"{base_q}{'.'.join(parts)}" if parts else base_q
            # object attribute → best-effort: qualify final attr in current scope
            return self.cur.q_of(parts[-1]) if parts else base_q
        return None

    def _get_binding_kind(self, name: str) -> str | None:
        """Determine the kind of binding for a name by looking up the binding chain"""
        for s in reversed(self.scopes):
            b = s.bind.get(name)
            if isinstance(b, LocalDef):
                return b.kind
            # ImportSymbol and ImportModule don't have kinds
        
        # Check if it's a built-in function
        if name in __builtins__ if isinstance(__builtins__, dict) else hasattr(__builtins__, name):
            return "builtin"
        
        return None

    def _analyze_sys_path_modification(self, node: ast.Call):
        """Analyze sys.path.append() calls to track dynamic path additions"""
        if (isinstance(node.func, ast.Attribute) and
            isinstance(node.func.value, ast.Attribute) and
            isinstance(node.func.value.value, ast.Name) and
            node.func.value.value.id == "sys" and
            node.func.value.attr == "path" and
            node.func.attr == "append" and
            len(node.args) == 1):

            # Try to extract the path being added
            arg = node.args[0]
            if isinstance(arg, ast.Call) and isinstance(arg.func, ast.Attribute):
                # Handle os.path.join(...) calls
                if (isinstance(arg.func.value, ast.Attribute) and
                    isinstance(arg.func.value.value, ast.Name) and
                    arg.func.value.value.id == "os" and
                    arg.func.value.attr == "path" and
                    arg.func.attr == "join"):

                    # Extract the path components from os.path.join
                    path_parts = []
                    for join_arg in arg.args:
                        if isinstance(join_arg, ast.Call):
                            # Handle os.path.dirname(__file__)
                            if (isinstance(join_arg.func, ast.Attribute) and
                                isinstance(join_arg.func.value, ast.Attribute) and
                                join_arg.func.attr == "dirname"):
                                path_parts.append("__file__")
                        elif isinstance(join_arg, ast.Constant):
                            path_parts.append(join_arg.value)

                    # Reconstruct the relative path
                    if path_parts and path_parts[0] == "__file__":
                        # This represents a relative path from the current file
                        relative_parts = path_parts[1:]  # Skip __file__
                        path_str = "/".join(relative_parts)
                        print(f"DEBUG: Found sys.path addition: {path_str} in module {self.mod}")  # Debug output
                        self.sys_path_additions.append(path_str)

    def _resolve_full_module_path(self, module_name: str) -> str:
        """Convert a potentially relative module name to a fully qualified path"""
        print(f"DEBUG: Resolving module '{module_name}' in context '{self.mod}' with sys_path_additions: {self.sys_path_additions}")  # Debug
        if module_name == "solution":
            # Check if we have sys.path modifications that might affect this
            for path_addition in self.sys_path_additions:
                if path_addition:  # Non-empty path addition
                    # Convert the path addition to a module path
                    # e.g., "../325-maximum-size-subarray-sum-equals-k" -> "problems.325-maximum-size-subarray-sum-equals-k"
                    current_parts = self.mod.split(".")
                    if path_addition.startswith("../"):
                        # Go up one directory and then down to the specified directory
                        target_dir = path_addition[3:]  # Remove "../"
                        if len(current_parts) >= 2:
                            # If we're in problems.525-contiguous-array.solution, go to problems.325-max...solution
                            # current_parts[:-1] gives us problems.525-contiguous-array, then [:-1] gives problems
                            base_parts = current_parts[:-1]  # Remove the current file name (solution)
                            if len(base_parts) >= 1:
                                root_parts = base_parts[:-1]  # Remove the current problem dir
                                resolved = ".".join(root_parts + [target_dir, "solution"])
                                print(f"DEBUG: Resolved '{module_name}' to '{resolved}'")  # Debug
                                return resolved

            # Fallback: assume it's in the same directory context
            current_parts = self.mod.split(".")
            if len(current_parts) >= 2:
                resolved = ".".join(current_parts[:-1] + ["solution"])
                print(f"DEBUG: Fallback resolved '{module_name}' to '{resolved}'")  # Debug
                return resolved
            else:
                return module_name
        return module_name

    def add_use(self, node: ast.AST, qname: str | None, kind: str | None = None):
        if qname:
            use_entry = {
                "range": lsp_range(node),
                "nameRange": name_range(node),
                "qname": qname,
                "kind": kind
            }
            self.uses.append(use_entry)

    # ---------- Imports ----------
    def visit_Import(self, node: ast.Import):
        for a in node.names:
            local = a.asname or a.name.split(".", 1)[0]
            self.define(local, ImportModule(a.name))

    def visit_ImportFrom(self, node: ast.ImportFrom):
        if node.module is None: return
        for a in node.names:
            if a.name == "*": continue  # skip star-imports
            local = a.asname or a.name
            # Convert relative module paths to fully qualified paths
            full_module = self._resolve_full_module_path(node.module)
            self.define(local, ImportSymbol(full_module, a.name))

    # ---------- Definitions (skip annotations) ----------
    def visit_FunctionDef(self, node: ast.FunctionDef):
        q = self.cur.q_of(node.name)
        # Determine if this is a method (inside a class) or a function
        kind = "method" if self.cur.is_class else "function"
        self.add_use(node, q, kind)
        self.define(node.name, LocalDef(q, kind))
        for dec in node.decorator_list: self.visit(dec)
        self.push(node.name)
        # Visit function arguments to capture parameters (now in function scope)
        for arg in node.args.args: self.visit(arg)
        for stmt in node.body: self.visit(stmt)   # DO NOT descend into annotations
        self.pop()

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_ClassDef(self, node: ast.ClassDef):
        q = self.cur.q_of(node.name)
        self.add_use(node, q, "class")
        self.define(node.name, LocalDef(q, "class"))
        for b in node.bases: self.visit(b)
        for kw in node.keywords: self.visit(kw.value)
        for dec in node.decorator_list: self.visit(dec)
        self.push(node.name, is_class=True)  # Mark that we're entering a class scope
        for stmt in node.body: self.visit(stmt)
        self.pop()

    # ---------- Assignments: define locals; skip annotation payloads ----------
    def visit_Assign(self, node: ast.Assign):
        for t in node.targets:
            self._handle_assignment_target(t)
        self.generic_visit(node)
    
    def _handle_assignment_target(self, target, is_comprehension=False):
        """Handle assignment targets including tuple unpacking"""
        if isinstance(target, ast.Name):
            q = self.cur.q_of(target.id)
            if not is_comprehension:  # Don't track comprehension variables
                self.add_use(target, q, "variable")  # Record the assignment as a use
            self.define(target.id, LocalDef(q, "variable"))
        elif isinstance(target, ast.Attribute):
            # Handle self.x = ... instance variable assignments
            if isinstance(target.value, ast.Name) and target.value.id == "self":
                attr_name = target.attr
                # Find enclosing class scope and register instance var
                for scope in reversed(self.scopes):
                    if scope.is_class:
                        qname = f"{self.mod}:{'.'.join(scope.qual)}.{attr_name}"
                        scope.instance_vars[attr_name] = qname
                        self.add_use(target, qname, "instance_variable")
                        break
        elif isinstance(target, (ast.Tuple, ast.List)):
            # Handle tuple/list unpacking like: l, r = 1, max(piles)
            for elt in target.elts:
                self._handle_assignment_target(elt, is_comprehension)

    def visit_AnnAssign(self, node: ast.AnnAssign):
        if isinstance(node.target, ast.Name):
            q = self.cur.q_of(node.target.id)
            self.define(node.target.id, LocalDef(q, "variable"))
        elif isinstance(node.target, ast.Attribute):
            # Handle self.x: Type = ... instance variable assignments
            if isinstance(node.target.value, ast.Name) and node.target.value.id == "self":
                attr_name = node.target.attr
                for scope in reversed(self.scopes):
                    if scope.is_class:
                        qname = f"{self.mod}:{'.'.join(scope.qual)}.{attr_name}"
                        scope.instance_vars[attr_name] = qname
                        self.add_use(node.target, qname, "instance_variable")
                        break
        if node.value: self.visit(node.value)  # skip node.annotation

    def visit_arg(self, node: ast.arg):
        # Define the parameter name as a local binding, but skip the annotation
        q = self.cur.q_of(node.arg)
        self.add_use(node, q, "parameter")  # Record as a use for IDE navigation
        self.define(node.arg, LocalDef(q, "parameter"))
        # Don't visit the annotation (node.annotation) to skip type annotations

    # ---------- Usages ----------
    def visit_Name(self, node: ast.Name):
        if isinstance(node.ctx, ast.Store):  # don't count pure stores as uses
            return
        
        # Skip comprehension variables
        if self.cur.is_comprehension:
            # Check if this name is defined in the comprehension scope
            if node.id in self.cur.bind:
                return  # Skip tracking comprehension variables
        
        # Resolve the name and determine kind from binding
        qname = self.resolve_name(node.id)
        kind = self._get_binding_kind(node.id)
        self.add_use(node, qname, kind)

    def visit_For(self, node: ast.For):
        # Handle for loop target (like: for x, y in ...)
        self._handle_assignment_target(node.target)
        # Visit the rest normally
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        # Check for sys.path modifications before visiting children
        self._analyze_sys_path_modification(node)
        self.generic_visit(node)

    def visit_Attribute(self, node: ast.Attribute):
        # visit children first, then record the full attr span
        self.generic_visit(node)
        # For attribute access, we don't know the kind from context alone
        self.add_use(node, self.resolve_attr_chain(node))

    # ---------- Comprehensions ----------
    def visit_ListComp(self, node: ast.ListComp):
        self._visit_comprehension(node, node.generators, node.elt)
    
    def visit_SetComp(self, node: ast.SetComp):
        self._visit_comprehension(node, node.generators, node.elt)
    
    def visit_DictComp(self, node: ast.DictComp):
        self._visit_comprehension(node, node.generators, node.key, node.value)
    
    def visit_GeneratorExp(self, node: ast.GeneratorExp):
        self._visit_comprehension(node, node.generators, node.elt)
    
    def _visit_comprehension(self, node: ast.AST, generators: list, *elements):
        """Handle comprehensions with proper scoping for iteration variables"""
        # Create a new scope for the comprehension
        self.push(is_comprehension=True)
        
        # Process generators in order (nested comprehensions)
        for gen in generators:
            # Visit the iterable first (in outer scope)
            self.visit(gen.iter)
            
            # Handle the target (iteration variable) - define it in comprehension scope
            self._handle_assignment_target(gen.target, is_comprehension=True)
            
            # Visit conditions (can reference iteration variables)
            for if_ in gen.ifs:
                self.visit(if_)
        
        # Visit the elements (can reference all iteration variables)
        for element in elements:
            if element:  # Some might be None (like in dict comprehensions)
                self.visit(element)
        
        self.pop()

# ---------- Driver ----------
def module_name(root: Path, file: Path) -> str:
    rel = file.resolve().relative_to(root.resolve())
    parts = list(rel.parts)
    parts[-1] = parts[-1].removesuffix(".py")
    return ".".join(parts)

def process_file(root: Path, path: Path) -> list[dict]:
    # Read and clean the code using the same logic as generate_symbol_tags.py
    raw_code = path.read_text(encoding="utf-8")
    cleaned_code = clean_code(raw_code)  # Now preserves imports
    
    # Parse the cleaned code to get consistent line numbers
    tree = ast.parse(cleaned_code)
    vis = Uses(module_name(root, path))
    vis.visit(tree)
    vis.uses.sort(key=lambda u: (u["range"]["start"]["line"], u["range"]["start"]["character"]))
    return vis.uses

def main():
    parser = argparse.ArgumentParser(description="Generate uses.json with identifier mappings")
    parser.add_argument("--root", default="backend/algorithms/new",
                        help="Root directory to scan for Python files")
    parser.add_argument("--out", default="lib/extracted-metadata/uses.json",
                        help="Output JSON file path")
    args = parser.parse_args()

    root = Path(args.root)
    index: dict[str, list[dict]] = {}
    for py in root.rglob("*.py"):
        # Use relative path from root instead of absolute URI
        rel_path = py.relative_to(root)
        index[str(rel_path)] = process_file(root, py)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    # Custom compact formatting for ranges
    def compact_json(obj, indent=0):
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
    
    out.write_text(compact_json(index), encoding="utf-8")
    print(f"Wrote {out} • {sum(len(v) for v in index.values())} uses")

if __name__ == "__main__":
    main()
