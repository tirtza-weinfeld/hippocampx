# Test Suite

This directory contains comprehensive tests for the `remark-smart-code-import` plugin.

## Structure

```
test/
├── unit/                    # Unit tests for individual functions
│   └── meta-parsing.test.ts # Tests for meta parsing functionality
├── integration/             # Integration tests (future)
├── fixtures/               # Test data and sample files
│   └── sample-code.py      # Sample Python code for testing
├── run-tests.ts            # Main test runner
└── README.md               # This file
```

## Running Tests

**Note**: Tests use `tsx` from the main project, not from the plugin's dependencies.

### All Tests
```bash
pnpm exec tsx plugins/remark-smart-code-import/test/run-tests.ts
```

### Unit Tests Only
```bash
pnpm exec tsx plugins/remark-smart-code-import/test/unit/meta-parsing.test.ts
```

### From Plugin Directory
```bash
cd plugins/remark-smart-code-import
pnpm exec tsx test/run-tests.ts
```

## Test Coverage

### Unit Tests
- **Meta Parsing**: Tests for parsing various meta attribute formats
  - Line-based imports (`#L5-L36`)
  - Function-based imports (`#func:functionName`)
  - Docstring stripping (`stripDocstring`)
  - Multiple meta attributes
  - Edge cases and error handling

### Integration Tests (Planned)
- Complete plugin workflow
- Real file system operations
- MDX processing integration
- Error handling scenarios

### Fixtures
- `sample-code.py`: Contains sample Python functions for testing extraction logic

## Adding New Tests

1. **Unit Tests**: Add to `unit/` directory
2. **Integration Tests**: Add to `integration/` directory  
3. **Fixtures**: Add test data to `fixtures/` directory
4. **Update Test Runner**: Add new test imports to `run-tests.ts`

## Test Conventions

- Use descriptive test names
- Test both success and failure cases
- Include edge cases and error conditions
- Keep tests focused and isolated
- Use fixtures for test data when possible
- No JS files are generated - tests run directly with tsx 