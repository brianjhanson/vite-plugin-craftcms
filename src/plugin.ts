import fs from "fs";
import path from "path";
import { Plugin, ResolvedConfig } from "vite";
import { defaultTemplateFunction, parseFile } from "./utils";

export default function craftPartials(options = {}) {
  const { outputFile, template, devServerBaseAddress } = Object.assign(
    {},
    {
      outputFile: "./templates/_partials/vite.twig",
      template: defaultTemplateFunction,
      devServerBaseAddress: "http://localhost",
    },
    options
  );

  let config: ResolvedConfig;
  let basePath: string;
  let proxyUrl: string;

  return {
    name: "craftcms",
    enforce: 'post',

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      const { base, server } = config;

      basePath = base;
      proxyUrl = `${devServerBaseAddress}:${server.port || 3000}`;
    },

    buildStart({ input }: any) {
      const { mode } = config;
      if (mode === "production") {
        return;
      }

      const inputFile = fs.readFileSync(input);
      const { head, body} = parseFile(inputFile.toString());

      fs.writeFileSync(
        outputFile,
        template({ head, body, basePath, mode, proxyUrl })
      );
    },

    transformIndexHtml: {
      enforce: 'post',
      transform(html: string) {
        const { mode } = config;

        if (mode !== "production") {
          return;
        }

        const { head, body} = parseFile(html);
        fs.writeFileSync(outputFile, template({ head, body, basePath, mode, proxyUrl }));
      },
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
