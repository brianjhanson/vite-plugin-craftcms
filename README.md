# Vite Plugin Craft CMS

A [vite](https://vitejs.dev/) plugin that that allows you to use vite with Craft CMS without a Craft plugin.

## General Approach

The plugin parses the `index.html` file created by Vite and generates a Craft twig partial from it. This way we get all benefits of the smart people working on Vite without adding a lot of overhead.

## Basic Usage

### Install the plugin

```
// TODO - publish the package
npm i -D vite-plugin-craftcms
```

### Create your entry file

```html
<head>
  <link rel="stylesheet" href="./styles/main.scss" />
</head>
<body>
  <script type="module" src="./scripts/main.js"></script>
</body>
```

This should be an HTML fragment located in your `./src` directory with a name that matches `rollupOptions.input` in your `vite.config`. The asset paths within this file should be relative to the file.

### Add the plugin to your `vite.config` file.

```js
import { vitePluginCraftCms } from "vite-plugin-craftcms";

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
      vitePluginCraftCms({
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
  <title>Craft Vite</title>
</head>

<body>
  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>
```

### Start it up

A file will be generated in the location specified by the `outputFile` option. The default template function collects all `script` and `link` elements and wraps them in either `{% html at head %}` or `{% html at endBody %}` in order to inject them into the `<head>` or `<body>`.

It will also replace all your relative URLs with URLs to the vite proxy server.

With the example entry above, that output fill will be:

```twig
{% html at head %}
<script type="module" src="http://localhost:3300/@vite/client"></script>
<link rel="stylesheet" href="http://localhost:3300/src/styles/main.scss">
{% endhtml%}
{% html at endBody %}
<script type="module" src="http://localhost:3300/src/scripts/main.js"></script>
{% endhtml %}
```

Now you can load up your site, and should be able to enjoy all that vite has to offer.

### Using multiple entry points

If your site requires multiple unique sets of assets, you can set multiple input files in your `vite.config` file:

```js
import { vitePluginCraftCms } from "vite-plugin-craftcms";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // …
    build: {
      rollupOptions: {
        input: ["./src/entry-one.html", "./src/entry-two.html"],
      },
    },
    plugins: [
      vitePluginCraftCms({
        outputFile: "./templates/_partials/vite-[name].twig",
      }),
    ],
  };
});
```

Your `outputFile` value in the plugin settings will need to include a `[name]` wildcard to generate appropriately named files.

### Static assets in Twig

If you need to reference static assets from Twig, you can use the included `url` Twig macro:

```twig
{% import "_partials/vite" as vite %}
<img src="{{ vite.url('images/foo.jpg') }}">
```

**Note:** This will only work for assets that are in the `publicDir` defined in your Vite config.
