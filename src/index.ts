import postcss, { Result, Root } from 'postcss';
import { Parser } from './services/parser';
import { Calculator } from './services/calculator';
import { Normalizer } from './services/normalizer';

const plugin = postcss.plugin('postcss-css-variables', (opts = {}) => {
    return (root: Root, result: Result) => {
        const parser = new Parser(root);
        const calculator = new Calculator(parser.getVariables());
        const normalizer = new Normalizer(root);

        normalizer.interpret(calculator.getInstructions());

        return root;
    };
});

module.exports = plugin;
export = plugin;
