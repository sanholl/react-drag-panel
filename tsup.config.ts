import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: './tsconfig.build.json',
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  sourcemap: true,
});
