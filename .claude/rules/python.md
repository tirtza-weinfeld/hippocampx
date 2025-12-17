---
paths: "**/*.py,backend/**"
---
# Python 3.13.7+ Rules

## Free-Threading & Concurrency (PEP 703)

* Enable free-threaded mode: `python3.13t` or `PYTHON_FREE_THREADING=1`
* Use `os.process_cpu_count()` for worker pool sizing
* Design for thread-safe parallel execution with GIL-free operation
* Leverage `concurrent.futures` with per-thread optimization
* Asyncio scales linearly across threads in free-threaded builds

## JIT Compilation (PEP 744)

* Enable experimental JIT: `PYTHON_JIT=1` for 30% computation speedups
* Configure build with `--enable-experimental-jit`
* Profile CPU-bound tasks for maximum JIT benefits

## Advanced Type System (PEP 742, 695, 705)

* `TypeIs[T]` for bidirectional type narrowing (superior to `TypeGuard`)
* Generic syntax: `def func[T](items: list[T]) -> T: ...`
* Type aliases: `type Vector[T] = list[T]` (not `TypeAlias`)
* `ReadOnly[T]` for immutable TypedDict fields
* Built-in generics: `list[int]`, `dict[str, Any]`, `set[float]`, `tuple[int, ...]`
* Union types: `int | str | None` (never `Union` or `Optional`)
* Generic `memoryview[T]` for typed buffer protocol
* `Protocol` for structural typing without inheritance
* `Self` for method chaining and builder patterns
* `Literal["exact", "values"]` for string/enum constraints
* `Never` for unreachable code and exhaustiveness
* `Final` for runtime constants (not just type hints)

## String & Numeric Enhancements

* f-string debugging: `f"{expression=}"` for inspection
* Numeric literal separators: `1_000_000`, `0xFF_FF_FF`
* String methods: `str.removeprefix()`, `str.removesuffix()`
* Raw f-strings: `rf"..."` for regex patterns

## Comprehensions & Advanced Control Flow

* List comprehensions with walrus: `[y for x in data if (y := transform(x)) > 0]`
* Dict comprehensions: `{k: (v := expensive_func(k)) for k in keys if v is not None}`
* Set comprehensions with filtering: `{normalize(x) for x in data if x.is_valid()}`
* Nested comprehensions: `[item for sublist in data for item in sublist if predicate(item)]`
* Walrus in while loops: `while (line := file.readline()):`
* Walrus with match: `match (result := compute_value()):`
* Structural pattern matching with guards: `case Point(x, y) if x > 0:`
* Exception groups: `except* (ValueError, TypeError) as eg:`
* Match statements for type discrimination and data extraction

## Data Structures & Properties

* `@dataclass(slots=True, frozen=True)` for performance and immutability
* `@cached_property` from `functools` for lazy evaluation
* Dict/set operators: `d1 | d2` (merge), `d1 |= d2` (update)
* Dataclass field factories: `field(default_factory=list)`

## Async/Await & Concurrency

* Context managers in async: `async with aiofiles.open(...)`
* Task groups: `async with asyncio.TaskGroup() as tg:`
* Exception handling: `except* asyncio.TimeoutError:`
* Async generators with `yield` and `async for`
* Free-threaded async execution across multiple event loops

## Modern Standard Library

* `pathlib.Path` with `/` operator: `Path.cwd() / "file.txt"`
* Context managers for all resource management
* `zoneinfo` for timezone-aware datetime operations
* `tomllib` for TOML configuration parsing
* `graphlib.TopologicalSorter` for dependency resolution

## iOS Platform Support (PEP 730)

* Official iOS tier-3 platform support
* Mobile-optimized Python applications
* Cross-platform deployment strategies

## Performance Optimizations

* Specializing adaptive interpreter (PEP 659) in free-threaded mode
* Incremental garbage collection for reduced pause times
* CPU-bound workload optimization with JIT compilation
* 5-15% general performance improvements over Python 3.12

## Error Handling & Debugging

* Exception groups with granular handling
* Rich traceback information with color coding
* Typo suggestions for Python keywords
* Enhanced REPL with syntax highlighting and autocompletion

## Security & Best Practices

* Avoid wildcard imports: explicit is better than implicit
* Use type hints consistently across all function signatures
* Leverage structural pattern matching for complex conditionals
* Employ context managers for resource lifecycle management
* Profile with JIT compiler for computation-heavy workflows
* Design thread-safe code for free-threaded execution
* Follow PEP 8 with modern tooling: `ruff`, `black`, `mypy --strict`

## Experimental Features

* Template strings (PEP 750) for advanced string templating
* Deferred annotation evaluation (PEP 649) - coming in 3.14
* Multiple interpreter support for isolation
* Tail-call optimization for functional programming patterns
