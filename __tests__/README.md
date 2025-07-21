# Testing Guidelines

## Overview

This document outlines the testing strategy and organization for HippocampX frontend tests. Our testing approach follows modern best practices with TypeScript-first development and comprehensive coverage.

## Test Structure

```
__tests__/
├── setup/
│   └── globals.ts              # Global test setup and mocks
├── utils/
│   ├── test-utils.tsx          # Custom render functions and utilities
│   └── mock-factories.ts       # Mock component factories
├── fixtures/
│   └── test-data.ts           # Test data and constants
├── components/
│   ├── mdx/                   # MDX component tests
│   │   ├── code/             # Code block tests
│   │   │   ├── transformers/  # Transformer tests
│   │   │   └── *.test.tsx
│   │   └── *.test.tsx
│   └── [domain]/             # Domain-specific component tests
├── lib/
│   └── *.test.ts             # Library/utility function tests
├── plugins/
│   └── *.test.ts             # MDX plugin tests
└── e2e/
    └── *.spec.ts             # End-to-end tests
```

## Testing Stack

### Unit & Integration Testing
- **Vitest**: Fast unit test runner with hot reload
- **React Testing Library**: Component testing with user-centric approach  
- **Happy DOM**: Lightweight DOM implementation
- **Vi (Vitest)**: Built-in mocking utilities

### End-to-End Testing
- **Playwright**: Cross-browser E2E testing
- **Multiple browsers**: Chromium, Firefox, WebKit
- **Visual regression**: Screenshot comparison
- **Trace viewer**: Debugging failed tests

## Test Categories

### 1. Component Tests (`__tests__/components/`)
Test React components in isolation with proper mocking.

```typescript
import { render, screen } from '../../../utils/test-utils'
import { testCode } from '../../../fixtures/test-data'

describe('CodeBlock Component', () => {
  it('renders with syntax highlighting', () => {
    render(
      <CodeBlock className="language-python">
        {testCode.python.simple}
      </CodeBlock>
    )
    
    expect(screen.getByTestId('code-block')).toBeInTheDocument()
  })
})
```

### 2. Library Tests (`__tests__/lib/`)
Test utility functions and business logic.

```typescript
import { describe, it, expect } from 'vitest'
import { someUtility } from '@/lib/utils'

describe('someUtility', () => {
  it('handles edge cases correctly', () => {
    expect(someUtility(null)).toBe(null)
  })
})
```

### 3. Plugin Tests (`__tests__/plugins/`)
Test MDX plugins and transformers.

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { myPlugin } from '@/plugins/my-plugin'

describe('My Plugin', () => {
  it('transforms markdown correctly', () => {
    const result = unified()
      .use(remarkParse)
      .use(myPlugin)
      .processSync('# Hello')
    
    expect(String(result)).toContain('transformed')
  })
})
```

### 4. E2E Tests (`__tests__/e2e/`)
Test complete user workflows across the application.

```typescript
import { test, expect } from '@playwright/test'

test.describe('Code Tooltips', () => {
  test('shows function documentation on hover', async ({ page }) => {
    await page.goto('/notes/algorithms')
    
    const codeElement = page.locator('code').first()
    await codeElement.hover()
    
    const tooltip = page.locator('[role="dialog"]')
    await expect(tooltip).toBeVisible()
  })
})
```

## Best Practices

### Test Organization
- **Mirror source structure**: Tests should mirror the `components/`, `lib/`, etc. structure
- **Descriptive names**: Use `ComponentName.test.tsx` for components, `utility-name.test.ts` for utilities
- **Group related tests**: Use `describe` blocks to group related test cases
- **Clear test names**: Test names should describe the expected behavior

### Mocking Strategy
- **Mock external dependencies**: Use `vi.mock()` for Next.js, external APIs, etc.
- **Mock heavy components**: Mock complex components that aren't being tested
- **Use factories**: Create reusable mock factories for common components
- **Isolate tests**: Each test should be independent and not rely on others

### Test Data
- **Use fixtures**: Store test data in `__tests__/fixtures/test-data.ts`
- **Realistic data**: Use data that resembles production data
- **Edge cases**: Include edge cases like empty strings, null values, large datasets

### Assertions
- **User-centric**: Test what users see and interact with
- **Accessible queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
- **Meaningful expectations**: Assert on behavior, not implementation details

## Common Patterns

### Component Testing with Providers
```typescript
import { render } from '../utils/test-utils' // Pre-configured with providers

const MyComponent = () => <div>Hello</div>

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Async Component Testing
```typescript
import { waitFor } from '@testing-library/react'

it('loads data asynchronously', async () => {
  render(<AsyncComponent />)
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### User Interaction Testing
```typescript
import { userEvent } from '@testing-library/user-event'

it('handles button clicks', async () => {
  const user = userEvent.setup()
  render(<Button onClick={mockFn}>Click me</Button>)
  
  await user.click(screen.getByRole('button'))
  expect(mockFn).toHaveBeenCalledOnce()
})
```

### E2E Testing with Page Objects
```typescript
class CodeTooltipPage {
  constructor(private page: Page) {}
  
  async hoverOverFunction(functionName: string) {
    await this.page.locator(`text=${functionName}`).hover()
  }
  
  async expectTooltipVisible() {
    await expect(this.page.locator('[role="dialog"]')).toBeVisible()
  }
}
```

## Running Tests

### Unit/Integration Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test --watch

# Run specific test file
pnpm test code-block.test.tsx
```

### E2E Tests
```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e:ui

# Run in headed mode (visible browser)
pnpm test:e2e:headed

# Debug mode
pnpm test:e2e:debug
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Nightly builds for comprehensive testing

### Coverage Requirements
- **Minimum 80%** line coverage
- **Minimum 80%** branch coverage
- **Critical paths**: 100% coverage for core functionality

### Performance Testing
- **Bundle size**: Track bundle size changes
- **Render performance**: Test component render times
- **E2E metrics**: Monitor Core Web Vitals in E2E tests

## Debugging Tests

### Unit Tests
```bash
# Run tests in debug mode
pnpm test --inspect-brk

# Use console.log in tests (temporary)
console.log(screen.debug()) // Prints DOM tree
```

### E2E Tests
```bash
# Record test execution
pnpm test:e2e --trace on

# Pause execution
await page.pause() // Pauses test execution
```

## Maintenance

### Regular Tasks
- **Update snapshots**: When UI changes are intentional
- **Review test coverage**: Ensure new code is tested
- **Update mocks**: When dependencies change
- **Performance monitoring**: Track test execution times

### Test Refactoring
- **Extract utilities**: Move common test logic to utilities
- **Update data**: Keep test data current with features
- **Remove obsolete tests**: Clean up tests for removed features
- **Optimize slow tests**: Identify and optimize slow-running tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)