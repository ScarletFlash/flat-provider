import { defineConfig } from 'vite';
import { default as reactPlugin } from '@vitejs/plugin-react';
import { default as dtsPlugin } from 'vite-plugin-dts';
import { resolve } from 'path';

const tsconfigPath: string = resolve(__dirname, 'tsconfig.lib.json');

export default defineConfig({
  plugins: [
    reactPlugin({
      include: ['src/index.ts']
    }),
    dtsPlugin({
      tsconfigPath,
      beforeWriteFile: (filePath: string, content: string) => ({
        filePath: filePath.replace('dist/src', 'dist'),
        content
      })
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react']
    },
    minify: true
  }
});
