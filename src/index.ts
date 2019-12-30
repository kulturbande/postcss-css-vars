import postcss, { Node, Result, Root } from 'postcss';
import { Parser } from './services/parser';
import { Calculator } from './services/calculator';

const plugin = postcss.plugin('postcss-css-variables', (opts = {}) => {
    // Work with options here

    return (root: Root, result: Result) => {
        const parser = new Parser(root);
        const calculator = new Calculator(root, parser.getVariables());

        calculator.calculateRulePermutations();
        return root;
    };
});

module.exports = plugin;
export = plugin;
