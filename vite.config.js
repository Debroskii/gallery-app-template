import { defineConfig } from 'vite';

// Base path is injected by the GitHub Actions workflow so the built
// site works correctly at https://<user>.github.io/<repo>/
// Locally it defaults to '/' so `npm run dev` / `npm run preview` just work.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
});
