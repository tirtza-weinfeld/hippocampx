<!-- # Testing Line Range Highlighting

This guide explains how to test the line range highlighting functionality in your HippocampX project.

## 🧪 Automated Tests

### 1. Run Unit Tests

```bash
# Run all tests
pnpm test

# Run only line range highlighting tests
pnpm test line-range-highlighting

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test --watch
```

### 2. Run Custom Test Script

```bash
# Run the comprehensive test script
pnpm tsx scripts/test-line-range-highlighting.ts
```

This script will test:
- ✅ Basic line range highlighting
- ✅ Tooltips within line ranges
- ✅ Multiple tooltips in same line range
- ✅ Expression tooltips
- ✅ Complex scenarios with multiple line ranges

## 🎯 Manual Testing

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Navigate to Test Page

Go to: http://localhost:3000/notes/binary-search

### 3. Visual Verification Checklist

#### Line Range Highlights
- [ ] **Lines 6-7**: Should appear as a unified purple rectangular block
- [ ] **Lines 8-9**: Should appear as a separate unified purple rectangular block
- [ ] **No fragmentation**: Each block should be one continuous rectangle, not multiple small boxes
- [ ] **Proper spacing**: Blocks should have appropriate margins and padding

#### Tooltip Functionality
- [ ] **Symbol tooltips**: Click on "mid", "lo", "hi", "x" - should show tooltips
- [ ] **Expression tooltip**: Click on the purple circle with "i" next to "(lo + hi) // 2"
- [ ] **Tooltip content**: Tooltips should display relevant information
- [ ] **Tooltip positioning**: Tooltips should appear in appropriate positions

#### CSS Styling
- [ ] **Purple background**: Line range highlights should have light purple background
- [ ] **Rounded corners**: Blocks should have rounded corners
- [ ] **Borders**: Blocks should have subtle borders
- [ ] **Hover effects**: Tooltip triggers should have hover effects

## 🔍 Debugging

### Check Browser Developer Tools

1. **Inspect Elements**:
   - Right-click on a line range highlight
   - Check that it has class `line-range-highlight`
   - Verify `data-line-range` and `data-expression` attributes

2. **Check CSS**:
   - Look for `.line-range-highlight` styles in the CSS
   - Verify sibling selectors are working for unified appearance

3. **Check Console**:
   - Look for any JavaScript errors
   - Verify tooltip components are rendering

### Common Issues

#### Fragmented Highlights
**Problem**: Line range highlights appear as multiple small boxes instead of unified rectangles.

**Solution**: Check that CSS sibling selectors are working:
```css
.line-range-highlight + .line-range-highlight[data-expression="same-expression"] {
  border-left: none;
  margin-left: 0;
}
```

#### Tooltips Not Working
**Problem**: Clicking on tooltip symbols doesn't show tooltips.

**Solution**: 
1. Check that `data-tooltip-symbol` attributes are present
2. Verify Popover components are rendering
3. Check for z-index conflicts

#### Missing Styling
**Problem**: Line range highlights don't have purple background.

**Solution**: Check that CSS file is loaded and `.line-range-highlight` styles are applied.

## 📋 Test Results Template

Use this template to document your test results:

```markdown
## Test Results - [Date]

### Automated Tests
- [ ] Unit tests pass: `pnpm test`
- [ ] Custom test script passes: `pnpm tsx scripts/test-line-range-highlighting.ts`

### Visual Tests
- [ ] Lines 6-7: Unified purple block ✅
- [ ] Lines 8-9: Unified purple block ✅
- [ ] Tooltip symbols clickable ✅
- [ ] Expression tooltip works ✅
- [ ] No visual fragmentation ✅

### Issues Found
- [ ] Issue 1: Description
- [ ] Issue 2: Description

### Notes
- Additional observations or notes
```

## 🚀 Quick Test Commands

```bash
# Quick visual test
pnpm dev
# Then visit: http://localhost:3000/notes/binary-search

# Quick automated test
pnpm tsx scripts/test-line-range-highlighting.ts

# Full test suite
pnpm test:coverage
```

## 📞 Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Inspect the HTML** to verify structure
3. **Check CSS** for styling issues
4. **Run automated tests** to isolate problems
5. **Review recent changes** to identify what might have broken

The line range highlighting system is designed to be robust and maintainable. If you find issues, they're likely related to CSS styling or component rendering rather than the core logic.  -->