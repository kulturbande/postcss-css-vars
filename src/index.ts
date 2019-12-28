import postcss, { Node, Result, Root } from 'postcss';
import { Parser } from './services/parser';

const plugin = postcss.plugin('postcss-css-variables', (opts = {}) => {
    // Work with options here

    return (root: Root, result: Result) => {
        const parser = new Parser(root);
        return root;
    };
});

module.exports = plugin;
export = plugin;
