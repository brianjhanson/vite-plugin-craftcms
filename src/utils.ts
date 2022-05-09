import { HTMLElement, parse } from "node-html-parser";
import { ParsedHtml, TemplateParams } from "./types";

function isValidElement(item: any): boolean {
  const validElements = ["script", "link"];
  return item instanceof HTMLElement
    && (validElements.includes(item.tagName) || validElements.includes(item.rawTagName));
}

/**
 * Parses an HTML string and separates it into scripts, links and meta tags
 */
export function parseFile(html: string): ParsedHtml {
  const root = parse(html);
  const headEl = root.querySelector("head");
  const bodyEl = root.querySelector("body");

  const head = <HTMLElement[]>headEl?.childNodes.filter(isValidElement);
  const body = <HTMLElement[]>bodyEl?.childNodes.filter(isValidElement);

  return {
    head,
    body
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
 * @param head
 * @param body
 * @param basePath
 * @param proxyUrl
 * @param mode
 */
export function defaultTemplateFunction({
  head = [],
  body = [],
  basePath = "",
  proxyUrl = "",
  mode = "production",
}: TemplateParams): string {
  replaceAttribute(head.concat(body), "src", "./", `${proxyUrl}/src/`);
  replaceAttribute(head.concat(body), "href", "./", `${proxyUrl}/src/`);

  // Create a string from HTML elements
  let headString = head.map((element) => element.outerHTML).join("");
  let endBodyString = body.map((element) => element.outerHTML).join("");

  let rootPath = mode === "development" ? proxyUrl : basePath;

  if (mode === "development") {
    headString = `<script type="module" src="${proxyUrl}/@vite/client"></script>${headString}`;
  }

  return `
{%- macro url(path) -%}{{ '${rootPath}' | replace('/\\\\/$/', '') }}{{ path }}{%- endmacro -%}
{% html at head %}${headString}{% endhtml %}
{% html at endBody %}${endBodyString}{% endhtml %}
`.trim();
}
