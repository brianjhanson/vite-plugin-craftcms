import { expect, test } from "vitest";
import {
  defaultTemplateFunction,
  parseFile,
  replaceAttribute,
} from "../src/utils";

const TEST_HTML = `
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="./styles/main.scss">
<link rel="stylesheet" href="./styles/test.scss">
<script type="module" src="./scripts/main.js"></script>
`;

test("parseFile", () => {
  const { scripts, links, meta } = parseFile(TEST_HTML);

  expect(scripts).toHaveLength(1);
  expect(links).toHaveLength(2);
  expect(meta).toHaveLength(1);
});

test("replaceAttribute", () => {
  const { scripts } = parseFile(TEST_HTML);

  const result = replaceAttribute(scripts, "src", "./", "http://localhost/");
  const expected = `<script type="module" src="http://localhost/scripts/main.js"></script>`;
  expect(result.toString()).toContain(expected);
});

test("defaultTemplateFunction production mode", () => {
  const { scripts, links } = parseFile(TEST_HTML);
  const result = defaultTemplateFunction({ scripts, links, basePath: "/dist/" });

  expect(result).toMatchSnapshot();
});

test("defaultTemplateFunction development mode", () => {
  const { scripts, links } = parseFile(TEST_HTML);
  const result = defaultTemplateFunction({
    scripts,
    links,
    mode: "development",
    proxyUrl: "http://localhost",
  });

  expect(result).toMatchSnapshot();
});
