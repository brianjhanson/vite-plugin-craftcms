import { ModuleFormat } from "rollup";

const path = require("path");
const { defineConfig } = require("vite");
import Inspect from "vite-plugin-inspect";

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Vite Plugin Craft CMS",
      fileName: (format: ModuleFormat) => `vite-plugin-craftcms.${format}.js`,
    },
  },
  optimizeDeps: {
    entries: "./src/**/*.{ts,js}",
  },
  plugins: [Inspect()],
});
