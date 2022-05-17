import { HTMLElement } from "node-html-parser";

export interface ParsedHtml {
  head: HTMLElement[];
  body: HTMLElement[];
}

export interface TemplateParams extends Partial<ParsedHtml> {
  basePath?: string;
  proxyUrl?: string;
  mode?: string;
}