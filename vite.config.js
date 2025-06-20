import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.*', '**/*.spec.*'],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OidcProviderSolid',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['solid-js', 'oidc-client-ts'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'oidc-client-ts': 'OidcClientTs',
        },
      },
    },
    target: 'es2020',
    sourcemap: true,
  },
});