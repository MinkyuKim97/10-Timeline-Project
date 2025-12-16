// import react from '@vitejs/plugin-react'

// export default {
//   base: process.env.REPO_NAME,
//   plugins: [
//     react(),
//   ],
// }
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/10-Timeline-Project/",
  plugins: [react()],
});