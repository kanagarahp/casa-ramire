import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` keeps the build portable: it works on GitHub Pages project
// sites (/<repo>/) as well as on any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
