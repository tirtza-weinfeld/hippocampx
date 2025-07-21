# Testing Guide

This document outlines the testing strategy and setup for the HippocampX backend.

## Overview

The backend uses a modern Python testing stack with pytest, organized into focused test categories for maintainable and efficient testing.

## Test Structure

```
backend/tests/
├── unit/           # Unit tests - isolated component testing
├── integration/    # Integration tests - multiple components
├── api/           # API endpoint testing
├── algorithms/    # Algorithm-specific tests
├── metadata/      # Metadata extraction testing
├── e2e/          # End-to-end testing
├── conftest.py   # Shared fixtures and configuration
└── utils.py      # Testing utilities and helpers
```

## Quick Start

```bash
# Run all tests
make test

# Run specific test categories
make test-unit
make test-api
make test-algorithms

# Run with coverage
make test-cov

# Run tests in watch mode
make test-watch
```

## Test Categories

### Unit Tests (`tests/unit/`)
- Test individual functions/classes in isolation
- Use mocks for external dependencies
- Fast execution (< 1s per test)
- Mark with `@pytest.mark.unit`

### Integration Tests (`tests/integration/`)
- Test multiple components working together
- May use real database/file system
- Mark with `@pytest.mark.integration`

### API Tests (`tests/api/`)
- Test HTTP endpoints and request/response cycles
- Use `AsyncClient` fixture for FastAPI testing
- Mark with `@pytest.mark.api`

### Algorithm Tests (`tests/algorithms/`)
- Test algorithm implementations and correctness
- Include performance benchmarks for critical algorithms
- Mark with `@pytest.mark.algorithms`

### Metadata Tests (`tests/metadata/`)
- Test code metadata extraction functionality
- Validate extracted symbols, links, and documentation
- Mark with `@pytest.mark.metadata`

### E2E Tests (`tests/e2e/`)
- Test complete user workflows
- May be slower running
- Mark with `@pytest.mark.e2e` and `@pytest.mark.slow`

## Configuration

### pyproject.toml
- Modern pytest configuration with parallel execution
- Coverage reporting with 80% threshold
- Strict markers and configuration
- Async testing support for Python 3.13+

### Test Markers
```python
@pytest.mark.unit          # Unit test
@pytest.mark.integration   # Integration test  
@pytest.mark.api          # API test
@pytest.mark.algorithms   # Algorithm test
@pytest.mark.metadata     # Metadata test
@pytest.mark.e2e         # End-to-end test
@pytest.mark.slow        # Slow running test
```

## Writing Tests

### Basic Test Structure
```python
import pytest
from tests.utils import assert_dict_subset, create_temp_python_file

@pytest.mark.unit
def test_example_function():
    """Test example function behavior."""
    # Arrange
    input_data = {"key": "value"}
    
    # Act
    result = example_function(input_data)
    
    # Assert
    assert result is not None
    assert_dict_subset({"expected": "value"}, result)
```

### Using Fixtures
```python
def test_with_project_root(project_root):
    """Test using project root fixture."""
    assert project_root.exists()
    assert (project_root / "backend").exists()

def test_with_test_data_builder(test_data_builder):
    """Test using test data builder."""
    metadata = test_data_builder.create_algorithm_metadata("test_func")
    assert metadata["name"] == "test_func"
```

### Async Testing
```python
@pytest.mark.asyncio
async def test_async_endpoint(async_client):
    """Test async API endpoint."""
    response = await async_client.get("/api/test")
    assert response.status_code == 200
```

### Temporary Files
```python
from tests.utils import create_temp_python_file

def test_with_temp_file():
    """Test with temporary Python file."""
    content = '''
    def example():
        return "test"
    '''
    temp_file = create_temp_python_file(content)
    
    # Test with temp_file
    assert temp_file.exists()
    
    # Cleanup
    temp_file.unlink()
```

## Available Fixtures

### Path Fixtures
- `project_root` - Root directory of the project
- `backend_root` - Backend directory  
- `examples_code_path` - Path to examples/code/
- `test_data_path` - Path to test data directory

### HTTP Client Fixtures  
- `async_client` - AsyncClient for API testing

### Utility Fixtures
- `test_data_builder` - Helper for creating test data
- `event_loop` - Session-scoped event loop

## Test Utilities

### Helper Functions (tests/utils.py)
- `create_temp_python_file()` - Create temporary Python files
- `assert_dict_subset()` - Assert dictionary subset matching
- `assert_valid_python_code()` - Validate Python syntax
- `count_code_lines()` - Count lines of code
- `extract_function_names()` - Parse function names from code
- `normalize_whitespace()` - Normalize text for comparison

### Mock Objects
- `MockPath` - Mock pathlib.Path for testing

## Coverage

### Running Coverage
```bash
# Generate coverage report
make test-cov

# View HTML report
open htmlcov/index.html
```

### Coverage Configuration
- **Target**: 80% minimum coverage
- **Excludes**: Test files, virtual environment, migrations
- **Reports**: Terminal, HTML, and XML formats
- **Branch coverage**: Enabled for thorough testing

## Code Quality

### Linting & Formatting
```bash
make lint        # Check code with ruff
make lint-fix    # Fix linting issues
make format      # Format code with ruff
```

### Type Checking
```bash
make type-check  # Run mypy type checking
```

### Combined Quality Check
```bash
make check       # Run lint + type-check
```

## Performance Testing

For algorithm tests, consider adding performance benchmarks:

```python
import time

@pytest.mark.algorithms
def test_algorithm_performance():
    """Test algorithm performance requirements."""
    start_time = time.perf_counter()
    
    # Run algorithm
    result = expensive_algorithm(large_dataset)
    
    end_time = time.perf_counter()
    execution_time = end_time - start_time
    
    assert execution_time < 1.0  # Should complete within 1 second
    assert result is not None
```

## Continuous Integration

The test suite is designed for CI/CD with:
- **Parallel execution** via pytest-xdist
- **Structured output** for CI parsing
- **Coverage reporting** in multiple formats
- **Fast feedback** with organized test categories

## Best Practices

1. **Test Organization**: Place tests in the appropriate category directory
2. **Clear Naming**: Use descriptive test function names
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Single Responsibility**: One concept per test
5. **Fast Tests**: Keep unit tests under 1 second
6. **Cleanup**: Use fixtures for setup/teardown
7. **Mocking**: Mock external dependencies in unit tests
8. **Documentation**: Document complex test scenarios

## Troubleshooting

### Common Issues

**Import Errors**:
- Ensure `backend/` is in Python path (handled by conftest.py)
- Check for circular imports

**Async Test Issues**:
- Use `@pytest.mark.asyncio` for async tests
- Use `async_client` fixture for HTTP testing

**Coverage Issues**:
- Check coverage configuration in pyproject.toml
- Ensure test files are in the correct directories

### Debug Mode
```bash
# Run with verbose output
pytest -v

# Run with debug on failure
pytest --pdb

# Run specific test with output
pytest -s tests/unit/test_specific.py::test_function
```