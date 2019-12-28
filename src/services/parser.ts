import { Root, ChildNode, Declaration, Rule } from 'postcss';
import { VariableInterface } from '../types/variable.interface';
import { Variable } from '../types/variable';

export class Parser {
    private variables: { [name: string]: VariableInterface } = {};

    constructor(root: Root) {
        this.parseRoot(root);
    }

    /**
     * parse the AST root to search for variables
     * @param root
     */
    private parseRoot(root: Root) {
        root.each((node: ChildNode, index: number) => {
            if (node.type === 'rule') {
                node.each((declationion: Declaration) => {
                    this.parseDeclaration(declationion, node);
                });
            }
        });
    }

    /**
     * Parse a declation of each rule to setup a collection of variables
     * @param declaration
     * @param rule
     */
    private parseDeclaration(declaration: Declaration, rule: Rule) {
        const setter = declaration.prop.match(/^(--\w+)/);
        const getter = declaration.value.match(/^var\((--\w+)\)/);

        if (setter !== null) {
            const name: string = setter[1];
            if (typeof this.variables[name] === 'undefined') {
                this.variables[name] = new Variable(name);
            }
            this.variables[name].addSetterRule(rule);
        } else if (getter !== null) {
            const name: string = getter[1];
            if (typeof this.variables[name] === 'undefined') {
                this.variables[name] = new Variable(name);
            }
            this.variables[name].addGetterRule(rule);
        }
    }
}
