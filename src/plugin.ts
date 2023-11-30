import fs from "fs";
import path from "path";
import { Plugin, ResolvedConfig } from "vite";
import {
  defaultTemplateFunction,
  filenameFromPath,
  formatOutputPath,
  getInputs,
  parseFile,
} from "./utils";

export default function craftPartials(options = {}) {
  const { outputFile, template, devServerBaseAddress } = Object.assign(
    {},
    {
      outputFile: "./templates/_partials/vite.twig",
      template: defaultTemplateFunction,
      devServerBaseAddress: "localhost",
    },
    options,
  );

  let config: ResolvedConfig;
  let basePath: string;
  let proxyUrl: string;

  return {
    name: "craftcms",
    enforce: "post",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      const { base, server } = config;

      basePath = base;
      if (server.origin) {
        proxyUrl = server.origin;
      } else {
        const protocol = server.https ? "https" : "http";
        proxyUrl = `${protocol}://${devServerBaseAddress}:${
          server.port || 3000
        }`;
      }
    },

    buildStart({ input }: any) {
      const { mode } = config;
      if (mode === "production") {
        return;
      }

      const inputs = getInputs(input);
      inputs.forEach((path) => {
        const inputFile = fs.readFileSync(path);
        const { head, body } = parseFile(inputFile.toString());

        // Get the filename from the path
        const filename = filenameFromPath(path);

        fs.writeFileSync(
          formatOutputPath(outputFile, filename || ""),
          template({ head, body, basePath, mode, proxyUrl }),
        );
      });
    },

    writeBundle(_, bundle) {
      const { mode } = config;

      if (mode !== "production") {
        return;
      }

      Object.keys(bundle).forEach((name) => {
        const asset = bundle[name];
        if (asset.fileName.match(/\.html$/) && "source" in asset) {
          console.log(`Generating ${asset.fileName} template...`);
          const { head, body } = parseFile(asset.source.toString());
          const filename = filenameFromPath(asset.fileName);
          fs.writeFileSync(
            formatOutputPath(outputFile, filename),
            template({ head, body, basePath, mode, proxyUrl }),
          );
        }
      });
    },

    async buildEnd(error) {
      if (error) throw error;
    },

    closeBundle() {
      console.log("Removing src files in dist ...");
      const outputPath = path.resolve(
        config.root,
        config.build.outDir,
        "./src",
      );

      fs.rmSync(outputPath, {
        recursive: true,
        force: true,
      });
    },
  } as Plugin;
}
