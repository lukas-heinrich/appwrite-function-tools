import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	outDir: 'dist',
	sourcemap: true,
	clean: true,
	dts: true,
});
