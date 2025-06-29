import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test-setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '@/public': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
}) 