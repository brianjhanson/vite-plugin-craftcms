import fs from "fs";
import path from "path";
import { ResolvedConfig } from "vite";
import { InputOptions } from "rollup";
import { defaultTemplateFunction, parseFile } from "./utils";

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
  let proxyUrl: string;

  return {
    name: "twig:test",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      const { server } = config;
      proxyUrl = `http://localhost:${server.port}`;
    },

    buildStart({ input }: InputOptions) {
      const { mode } = config;
      if (mode === "production") {
        return;
      }

      const inputFile = fs.readFileSync(input as string);
      const { scripts, links, meta } = parseFile(inputFile.toString());

      fs.writeFileSync(
        outputFile,
        template({ scripts, links, meta, mode, proxyUrl })
      );
    },

    transformIndexHtml(html: string) {
      const { mode } = config;

      if (mode !== "production") {
        return;
      }

      const { scripts, links, meta } = parseFile(html);
      fs.writeFileSync(outputFile, template({ scripts, links, meta, mode }));
    },

    closeBundle() {
      console.log("Removing src files in dist ...");
      fs.rmSync(path.resolve(config.publicDir, "./src"), {
        recursive: true,
        force: true,
      });
    },
  };
}
