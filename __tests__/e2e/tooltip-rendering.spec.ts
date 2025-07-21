import { test, expect } from '@playwright/test';

test.describe('Tooltip Rendering (code_metadata.json symbols)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-tooltips');
  });

  test('renders function tooltip for maxSubArrayLen', async ({ page }) => {
    const fn = page.locator('text=maxSubArrayLen').first();
    await expect(fn).toBeVisible();
    await fn.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=maxSubArrayLen')).toBeVisible();
    await expect(tooltip.locator('text=function')).toBeVisible();
    await expect(tooltip.locator('text=def maxSubArrayLen(nums: list[int], k: int) -> int:')).toBeVisible();
    await expect(tooltip.locator('text=Find the maximum length of a subarray that sums to exactly k.')).toBeVisible();
    await expect(tooltip.locator('text=Parameters:')).toBeVisible();
    await expect(tooltip.locator('text=nums')).toBeVisible();
    await expect(tooltip.locator('text=k')).toBeVisible();
    await expect(tooltip.locator('text=Returns:')).toBeVisible();
    await expect(tooltip.locator('text=int')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders function tooltip for subarraySum', async ({ page }) => {
    const fn = page.locator('text=subarraySum').first();
    await expect(fn).toBeVisible();
    await fn.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=subarraySum')).toBeVisible();
    await expect(tooltip.locator('text=function')).toBeVisible();
    await expect(tooltip.locator('text=def subarraySum(nums: list[int], k: int) -> int:')).toBeVisible();
    await expect(tooltip.locator('text=Count the number of subarrays that sum to exactly k.')).toBeVisible();
    await expect(tooltip.locator('text=Parameters:')).toBeVisible();
    await expect(tooltip.locator('text=nums')).toBeVisible();
    await expect(tooltip.locator('text=k')).toBeVisible();
    await expect(tooltip.locator('text=Returns:')).toBeVisible();
    await expect(tooltip.locator('text=int')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders function tooltip for findMaxLength', async ({ page }) => {
    const fn = page.locator('text=findMaxLength').first();
    await expect(fn).toBeVisible();
    await fn.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=findMaxLength')).toBeVisible();
    await expect(tooltip.locator('text=function')).toBeVisible();
    await expect(tooltip.locator('text=def findMaxLength(nums: list[int]) -> int:')).toBeVisible();
    await expect(tooltip.locator('text=Find the maximum length of a contiguous subarray with equal number of positive and negative (or 1 and -1) values.')).toBeVisible();
    await expect(tooltip.locator('text=Parameters:')).toBeVisible();
    await expect(tooltip.locator('text=nums')).toBeVisible();
    await expect(tooltip.locator('text=Returns:')).toBeVisible();
    await expect(tooltip.locator('text=int')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders class tooltip for LRUCache', async ({ page }) => {
    const cls = page.locator('text=LRUCache').first();
    await expect(cls).toBeVisible();
    await cls.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=LRUCache')).toBeVisible();
    await expect(tooltip.locator('text=class')).toBeVisible();
    await expect(tooltip.locator('text=class LRUCache:')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders class tooltip for LFUCache', async ({ page }) => {
    const cls = page.locator('text=LFUCache').first();
    await expect(cls).toBeVisible();
    await cls.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=LFUCache')).toBeVisible();
    await expect(tooltip.locator('text=class')).toBeVisible();
    await expect(tooltip.locator('text=class LFUCache:')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders method tooltip for LRUCache.get', async ({ page }) => {
    const method = page.locator('text=get').first();
    await expect(method).toBeVisible();
    await method.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=get')).toBeVisible();
    await expect(tooltip.locator('text=method')).toBeVisible();
    await expect(tooltip.locator('text=def get(self, key: int) -> int:')).toBeVisible();
    await expect(tooltip.locator('text=Returns:')).toBeVisible();
    await expect(tooltip.locator('text=int')).toBeVisible();
    await expect(tooltip.locator('pre code')).toBeVisible();
  });

  test('renders parameter tooltip for nums in maxSubArrayLen', async ({ page }) => {
    const param = page.locator('text=nums').first();
    await expect(param).toBeVisible();
    await param.hover();
    const tooltip = page.locator('[role="dialog"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('text=(parameter) nums: list[int]')).toBeVisible();
    await expect(tooltip.locator('text=nums: List of integers.')).toBeVisible();
  });
}); 