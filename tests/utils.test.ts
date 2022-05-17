import { expect, test } from "vitest";
import {
  defaultTemplateFunction,
  parseFile,
  replaceAttribute,
} from "../src/utils";

const TEST_HTML = `
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="./styles/main.scss">
  <link rel="stylesheet" href="./styles/test.scss">
</head>
<body>
  <script type="module" src="./scripts/main.js"></script>
</body>
`;

test("parseFile", () => {
  const { head, body } = parseFile(TEST_HTML);

  expect(head).toHaveLength(2);
  expect(body).toHaveLength(1);
});

test("replaceAttribute", () => {
  const { body } = parseFile(TEST_HTML);

  const result = replaceAttribute(body, "src", "./", "http://localhost/");
  const expected = `<script type="module" src="http://localhost/scripts/main.js"></script>`;
  expect(result.toString()).toContain(expected);
});

test("defaultTemplateFunction production mode", () => {
  const { head, body } = parseFile(TEST_HTML);
  const result = defaultTemplateFunction({ head, body, basePath: "/dist/" });

  expect(result).toMatchSnapshot();
});

test("defaultTemplateFunction development mode", () => {
  const { head, body } = parseFile(TEST_HTML);
  const result = defaultTemplateFunction({
    head,
    body,
    mode: "development",
    proxyUrl: "http://localhost",
  });

  expect(result).toMatchSnapshot();
});
