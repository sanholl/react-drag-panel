import { defineConfig } from 'vitest/config';

const vitestConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    tsconfig: './tsconfig.vitest.json'
  }
}

export default defineConfig({
  ...vitestConfig
});