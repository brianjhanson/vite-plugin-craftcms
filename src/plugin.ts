import fs from "fs";
import path from "path";
import { Plugin, ResolvedConfig } from "vite";
import { defaultTemplateFunction, parseFile } from "./utils";
import { NormalizedInputOptions } from "rollup";

export default function craftPartials(options = {}) {
  const { outputFile, template } = Object.assign(
    {},
    {
      outputFile: "./templates/_partials/vite.twig",
      template: defaultTemplateFunction,
    },
    options
  );

  let config: ResolvedConfig;
  let basePath: string;
  let proxyUrl: string;

  return {
    name: "twig:test",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      const { base, server } = config;

      basePath = base;
      proxyUrl = `http://localhost:${server.port || 3000}`;
    },

    buildStart({ input }: any) {
      const { mode } = config;
      if (mode === "production") {
        return;
      }

      const inputFile = fs.readFileSync(input);
      const { scripts, links, meta } = parseFile(inputFile.toString());

      fs.writeFileSync(
        outputFile,
        template({ scripts, links, meta, basePath, mode, proxyUrl })
      );
    },

    transformIndexHtml(html: string) {
      const { mode } = config;

      if (mode !== "production") {
        return;
      }

      const { scripts, links, meta } = parseFile(html);
      fs.writeFileSync(outputFile, template({ scripts, links, meta, basePath, mode, proxyUrl }));
    },

    closeBundle() {
      console.log("Removing src files in dist ...");
      const outputPath = path.resolve(
        config.root,
        config.build.outDir,
        "./src"
      );

      fs.rmSync(outputPath, {
        recursive: true,
        force: true,
      });
    },
  } as Plugin;
}
