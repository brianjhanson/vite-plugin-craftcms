# Vite Plugin Craft CMS

A [vite](https://vitejs.dev/) plugin that that allows you to use vite with Craft CMS without a Craft plugin.

## General Approach

The plugin parses the `index.html` file created by Vite and generates a Craft twig partial from it. This way we get all benefits of the smart peoeple working on Vite without adding a lot of overhead.

## Basic Usage

### Install the plugin

```
// TODO - publish the package
npm i -D vite-plugin-craftcms
```

### Create your entry file

```html
<link rel="stylesheet" href="./styles/main.scss" />
<script type="module" src="./scripts/main.js"></script>
```

This should be an HTML fragment located in your `./src` directory. The asset paths within this file should be relative to the file. 

### Add the plugin to your `vite.config` file.

```js
import viteCraftCms from "vite-plugin-craftcms";
// your other imports

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: command === "serve" ? "" : "/dist/",
    publicDir: "./web/dist",
    server: {
      port: process.env.VITE_DEV_PORT || 3000,
    },
    build: {
      emptyOutDir: true,
      manifest: true,
      outDir: "./web/dist/",
      rollupOptions: {
        input: "./src/entry.html",
      },
    },
    plugins: [
      craftPartials({
        outputFile: "./templates/_partials/vite.twig",
      }),
      viteRestart({
        reload: ["./templates/**/*"],
      }),
    ],
  };
});
```

### Import the partial
```twig
{#
 # =========================================================
 # Layout template
 # =========================================================
#}

{% include '_partials/vite' ignore missing %}

<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Craft Vite Boilerplate</title>
</head>

<body>
  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>
```
### Start it up

A file will be generated in the location specified by the `outputFile` option. The default template function collects all the `meta` and `link` elements and wraps them in `{% html at head %}` in order to inject them into the head. While `script` tags are added at the end of the body. 

It will also replace all your relative URLs with URLs to the vite proxy server.

With the example entry above, that output fill will be:
```twig
<script type="module" src="http://localhost:3300/@vite/client"></script>
{% html at head %}
<link rel="stylesheet" href="http://localhost:3300/src/styles/main.scss">
{% endhtml%}
{% html at endBody %}
<script type="module" src="http://localhost:3300/src/scripts/main.js"></script>
{% endhtml %}
```

Now you can load up your site, and should be able to enjoy all that vite has to offer. 

