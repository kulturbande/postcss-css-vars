import { Declaration, Root, Rule } from 'postcss';
import { VariableInterface } from '../entities/interfaces/variable.interface';
import { Variable } from '../entities/variable';

export class Parser {
    private variables: { [name: string]: VariableInterface } = {};

    constructor(private root: Root) {}

    /**
     * parse the root and get all variables
     */
    public getVariables(): VariableInterface[] {
        this.parseRoot(this.root);
        return Object.values(this.variables);
    }

    /**
     * parse the AST root to search for variables
     * @param root
     */
    private parseRoot(root: Root) {
        root.walkDecls((declaration: Declaration) => {
            this.parseDeclaration(declaration);
        });
    }

    /**
     * Parse a declaration of each rule to setup a collection of variables
     * @param declaration
     * @param rule
     */
    private parseDeclaration(declaration: Declaration) {
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
