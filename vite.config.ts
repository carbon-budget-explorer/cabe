import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { isoImport } from 'vite-plugin-iso-import';

export default defineConfig({
	plugins: [sveltekit(), isoImport()],
	test: {
		// Exclude /tests/ as it contains playwright tests
		include: ['**/__tests__/**/*.?(c|m)[jt]s?(x)', 'src/**/?(*.){test,spec}.?(c|m)[jt]s?(x)']
	}
});
