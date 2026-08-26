import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.jsx",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/test/**", "src/main.jsx"],
    },
  },
});
