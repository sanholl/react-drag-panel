import { defineConfig } from 'vitest/config';

const vitestConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    tsconfig: './tsconfig.vitest.json',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'examples/**',
        '**/*.config.{js,ts}',
        'src/types/**',
      ]
    }
  }
}

export default defineConfig({
  ...vitestConfig
});