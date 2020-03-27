# PostCSS Css Vars - Resolve CSS Custom Properties

[![Build Status](https://travis-ci.com/kulturbande/postcss-css-vars.svg?branch=master)](https://travis-ci.com/kulturbande/postcss-css-vars)

[PostCSS] plugin for CSS Custom Properties. The purpose is mainly to write more modern CSS code if you need to support older browsers like the Internet Explorer 11.

[postcss]: https://github.com/postcss/postcss

## Examples

### Direct usage

```css
.foo {
    --color: red;
    color: var(--color);
    font-size: var(--font-size, 1em);
    border: 1px solid var(-color);
}
/* becomes */
.foo {
    color: red;
    font-size: 1em;
    border: 1px solid red;
}
```

### Host/Body - usage

```css
:host {
    --color: red;
}
.foo {
    color: var(--color);
    border: 1px solid var(--color);
}
/* becomes */
.foo {
    color: red;
    border: 1px solid red;
}
```

### Media Queries

```css
:host {
    --color: red;
}
.foo {
    color: var(--color);
    border: 1px solid var(--color);
}
@media (min-width: 30em) {
    --color: orange;
}
/* becomes */
.foo {
    color: red;
    border: 1px solid red;
}
@media (min-width: 30em) {
    .foo {
        color: orange;
    }
}
```

### Permutations

```css
:host {
    --color: red;
}
.foo {
    color: var(--color);
    border: 1px solid var(--color);
}
.orange {
    --color: orange;
}
/* becomes */
.foo {
    color: red;
    border: 1px solid red;
}
.orange .foo {
    color: orange;
    border: 1px solid orange;
}
```

## Usage

Install the package:

```bash
$ yarn add postcss-css-vars --save
```

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-css-vars'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
