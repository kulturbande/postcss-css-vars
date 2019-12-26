let postcss = require("postcss");

module.exports = postcss.plugin("postcss-css-variables", (opts = {}) => {
  // Work with options here

  return (root, result) => {
    console.log(root);
  };
});
