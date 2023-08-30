import { defineConfig } from "vite";
import { vitePluginCraftCms } from "../../src/index";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "./dist/",
      rollupOptions: {
        input: [
          "./src/entry-one.html",
          "./src/entry-two.html",
        ],
      },
    },
    plugins: [
      vitePluginCraftCms({
        outputFile: "./templates/vite-*.twig",
      }),
    ],
  };
});
