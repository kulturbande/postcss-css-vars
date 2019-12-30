# PostCSS Css Variables

[![Build Status](https://travis-ci.com/kulturbande/postcss-css-variables.svg?branch=master)](https://travis-ci.com/kulturbande/postcss-css-variables)

[PostCSS] plugin for CSS Custom Properties. This repository is currentyly in development and will be used to support older browser, that are not Custom Properties - enabled.

[postcss]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
}
```

```css
.foo {
    /* Output example */
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-css-variables'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
