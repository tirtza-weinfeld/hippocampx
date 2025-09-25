import { describe, it, expect } from 'vitest'
import { getStepColor, isValidColorName, getColorStep } from '@/lib/step-colors'

describe('Step Colors', () => {
  it('should map step numbers to correct colors', () => {
    expect(getStepColor(1)).toBe('red')
    expect(getStepColor(2)).toBe('orange')
    expect(getStepColor(3)).toBe('amber')
    expect(getStepColor(4)).toBe('yellow')
    expect(getStepColor(5)).toBe('lime')
    expect(getStepColor(19)).toBe('gray') // This is the one from the problem text
  })

  it('should validate color names correctly', () => {
    expect(isValidColorName('red')).toBe(true)
    expect(isValidColorName('blue')).toBe(true)
    expect(isValidColorName('gray')).toBe(true)
    expect(isValidColorName('invalidcolor')).toBe(false)
  })

  it('should map colors back to step numbers', () => {
    expect(getColorStep('red')).toBe(1)
    expect(getColorStep('orange')).toBe(2)
    expect(getColorStep('gray')).toBe(19)
  })

  it('should handle step number wrapping correctly', () => {
    // Test that step numbers wrap around the color array (22 colors total)
    expect(getStepColor(23)).toBe('red') // Should wrap to first color after 22
    expect(getStepColor(24)).toBe('orange') // Should wrap to second color
    expect(getStepColor(26)).toBe('yellow') // Step 26 maps to index 3 (yellow)
  })
})