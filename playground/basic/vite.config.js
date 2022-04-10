import { defineConfig } from "vite";
import { VitePluginCraftCms } from "../../src/index";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "./dist/",
      rollupOptions: {
        input: "./src/entry.html",
      },
    },
    plugins: [
      VitePluginCraftCms({
        outputFile: "./dist/vite.twig",
      }),
    ],
  };
});
