import postcss from 'postcss';

const plugin = postcss.plugin('postcss-css-variables', (opts = {}) => {
    // Work with options here

    return (root, result) => {};
});

module.exports = plugin;
export = plugin;
