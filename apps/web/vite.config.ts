import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rootModules = path.resolve(__dirname, "../../node_modules");
const litReactive = path.join(rootModules, "@lit/reactive-element");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: /^@lit\/reactive-element\/decorators\/(.+\.js)$/,
        replacement: `${litReactive}/node/decorators/$1`,
      },
      {
        find: /^@lit\/reactive-element\/development\/decorators\/(.+\.js)$/,
        replacement: `${litReactive}/node/development/decorators/$1`,
      },
      {
        find: "@lit/reactive-element/development",
        replacement: litReactive,
      },
    ],
    conditions: ["browser", "import", "module", "default"],
  },
  optimizeDeps: {
    esbuildOptions: {
      conditions: ["browser", "import", "module", "default"],
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
