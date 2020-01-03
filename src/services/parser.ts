import { Root, ChildNode, Declaration, Rule } from 'postcss';
import { VariableInterface } from '../entities/interfaces/variable.interface';
import { Variable } from '../entities/variable';

export class Parser {
    private variables: { [name: string]: VariableInterface } = {};

    constructor(root: Root) {
        this.parseRoot(root);
    }

    public getVariables(): VariableInterface[] {
        return Object.values(this.variables);
    }

    /**
     * parse the AST root to search for variables
     * @param root
     */
    private parseRoot(root: Root) {
        root.each((node: ChildNode, index: number) => {
            if (node.type === 'rule') {
                this.parseRule(node);
            } else if (node.type === 'atrule') {
                node.nodes?.forEach((node: ChildNode) => {
                    this.parseRule(node as Rule);
                });
            }
        });
    }

    /**
     * parse the rule and find the usage of variables
     * @param rule the rule to parse
     */
    private parseRule(rule: Rule) {
        rule.walkDecls((declationion: Declaration) => {
            this.parseDeclaration(declationion, rule);
        });
    }

    /**
     * Parse a declation of each rule to setup a collection of variables
     * @param declaration
     * @param rule
     */
    private parseDeclaration(declaration: Declaration, rule: Rule) {
        const setter = declaration.prop.match(/^(--[\w|\-]+)/);
        const getter = declaration.value.match(/var\((--[\w|\-]+)\)/);

        const initializeVariable = (name: string): string => {
            if (typeof this.variables[name] === 'undefined') {
                this.variables[name] = new Variable(name);
            }
            return name;
        };

        if (setter !== null) {
            const name: string = initializeVariable(setter[1]);
            this.variables[name].addSetterDeclaration(declaration);
        } else if (getter !== null) {
            const name: string = initializeVariable(getter[1]);
            this.variables[name].addGetterDeclaration(declaration);
        }
    }
}
