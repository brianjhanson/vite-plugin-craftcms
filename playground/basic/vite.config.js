import { defineConfig } from "vite";
import { vitePluginCraftCms } from "../../src/index";

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
      vitePluginCraftCms({
        outputFile: "./dist/vite.twig",
      }),
    ],
  };
});
