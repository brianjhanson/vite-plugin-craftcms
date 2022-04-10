import { HTMLElement, parse } from "node-html-parser";
import { ParsedHtml, TemplateParams } from "./types";

/**
 * Parses an HTML string and separates it into scripts, links and meta tags
 */
export function parseFile(html: string): ParsedHtml {
  const root = parse(html);
  const scripts = root.querySelectorAll("script");
  const links = root.querySelectorAll("link");
  const meta = root.querySelectorAll("meta");

  return {
    scripts,
    links,
    meta,
  };
}

/**
 * Replaces values within an attribute string
 *
 * @param {HTMLElement[]} elements Element for replacement
 * @param {string} attribute Attribute to target
 * @param {string} search Value to search for
 * @param {string} replace Replacement value
 */
export function replaceAttribute(
  elements: HTMLElement[],
  attribute: string,
  search: string,
  replace: string
) {
  return elements.map((element) => {
    const currentValue = element.getAttribute(attribute);

    if (currentValue) {
      const newValue = currentValue.replace(search, replace);
      element.setAttribute(attribute, newValue);
    }

    return element;
  });
}

/**
 *
 * @param scripts
 * @param links
 * @param meta
 * @param proxyUrl
 * @param mode
 */
export function defaultTemplateFunction({
  scripts = [],
  links = [],
  meta = [],
  proxyUrl = "",
  mode = "production",
}: TemplateParams): string {
  const scriptTags = replaceAttribute(scripts, "src", "./", `${proxyUrl}/src/`);
  const linkTags = replaceAttribute(links, "href", "./", `${proxyUrl}/src/`);

  let headString = `${meta.toString()}${linkTags.toString()}`;
  let endBody = `${scriptTags.toString()}`;

  if (mode === "development") {
    headString = `<script type="module" src="${proxyUrl}/@vite/client"></script>${headString}`;
  }

  return `
  {% html at head %}${headString}{% endhtml %}
  {% html at endBody %}${endBody}{% endhtml %}
  `.trim();
}
