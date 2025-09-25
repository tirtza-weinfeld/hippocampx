/**
 * Illustrations Index
 * Main entry point for all algorithm and problem illustrations
 */

// Export all core technique illustrations
export * from './core';

// Export all problem-specific illustrations  
export * from './problems';

// Combined exports for backwards compatibility
import { coreIllustrations } from './core';
import { problemIllustrations, problemIllustrations as PROBLEM_ILLUSTRATIONS} from './problems';

// Unified illustration mappings
export const allIllustrations = {
  ...coreIllustrations,
  ...problemIllustrations
};

// Unified getter function that checks both core and problem illustrations
export const getIllustration = (name: string) => {
  // Try core illustrations first
  const coreIllustration = coreIllustrations[name as keyof typeof coreIllustrations] || coreIllustrations.default;
  if (coreIllustration !== coreIllustrations.default) {
    return coreIllustration;
  }
  
  // Fall back to problem illustrations
  const problemIllustration = PROBLEM_ILLUSTRATIONS[name as keyof typeof PROBLEM_ILLUSTRATIONS] || PROBLEM_ILLUSTRATIONS.default;
  if (problemIllustration !== problemIllustrations.default) {
    return problemIllustration;
  }
  
  // Final fallback
  return coreIllustrations.default;
};

// Legacy exports for backwards compatibility with existing code
export const algorithmIllustrations = coreIllustrations;
export const getAlgorithmIllustration = (name: string) => {
  return coreIllustrations[name as keyof typeof coreIllustrations] || coreIllustrations.default;
};