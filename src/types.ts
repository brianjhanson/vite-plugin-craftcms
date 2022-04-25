import { HTMLElement } from "node-html-parser";

export interface ParsedHtml {
  scripts: HTMLElement[];
  links: HTMLElement[];
  meta: HTMLElement[];
}

export interface TemplateParams extends Partial<ParsedHtml> {
  basePath?: string;
  proxyUrl?: string;
  mode?: string;
}