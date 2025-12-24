import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./__tests__/setup/globals.ts'],
    include: [
      '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'plugins/**/*.{test,spec}.{js,ts}' // Keep plugin tests in their folders
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '.next/',
      'backend/tests/**', // Exclude Python tests
      'e2e/**', // E2E tests handled by Playwright
      '__tests__/browser/**', // Browser tests run separately
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/**',
        'e2e/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'backend/**',
      ],
      include: [
        'components/**/*.{js,ts,jsx,tsx}',
        'lib/**/*.{js,ts}',
        'plugins/**/*.{js,ts}',
        'app/**/*.{js,ts,jsx,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '@/public': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
}) 