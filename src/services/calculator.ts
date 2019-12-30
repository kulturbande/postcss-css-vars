import { VariableInterface } from '../types/variable.interface';
import { Root, Declaration, Rule } from 'postcss';

export class Calculator {
    private globalVariables: { [name: string]: string } = {};
    private cleanUpDeclarations: Declaration[] = [];

    constructor(private root: Root, private variables: VariableInterface[]) {}

    public calculateRulePermutations() {
        this.variables.forEach((variable: VariableInterface) => {
            this.compareDeclarationsOfVariable(variable);
        });
        this.cleanup();
    }

    private compareDeclarationsOfVariable(variable: VariableInterface) {
        variable.getSetterDeclarations().forEach((setterDeclaration: Declaration) => {
            variable.getGetterDeclarations().forEach((getterDeclaration: Declaration) => {
                this.compareDeclarations(variable, setterDeclaration, getterDeclaration);
            });
        });
    }

    private compareDeclarations(
        variable: VariableInterface,
        setterDeclaration: Declaration,
        getterDeclaration: Declaration
    ) {
        const setterRule = this.getParentRule(setterDeclaration);
        const getterRule = this.getParentRule(getterDeclaration);

        if (setterRule?.selector === ':root' || setterRule?.selector === 'body') {
            // root level declarations
            this.globalVariables[variable.name] = setterDeclaration.value;
            this.removeDeclartaion(setterDeclaration);
        }

        if (setterRule === getterRule) {
            this.replaceDeclaration(getterDeclaration, variable.name, setterDeclaration.value);
            this.removeDeclartaion(setterDeclaration);
        }

        if (typeof this.globalVariables[variable.name] !== 'undefined') {
            this.replaceDeclaration(getterDeclaration, variable.name, this.globalVariables[variable.name]);
        }
    }

    private removeDeclartaion(declaration: Declaration) {
        if (this.cleanUpDeclarations.indexOf(declaration) === -1) {
            this.cleanUpDeclarations.push(declaration);
        }
    }

    private replaceDeclaration(getterDeclaration: Declaration, variable: string, value: string) {
        const replacedWith = new RegExp('var\\(' + variable + '\\)');
        getterDeclaration.value = getterDeclaration.value.replace(replacedWith, value);
    }

    private getParentRule(declaration: Declaration): Rule | null {
        if (declaration.parent?.type === 'rule') {
            return declaration.parent;
        }
        return null;
    }

    private cleanup(): void {
        this.cleanUpDeclarations.forEach((declaration: Declaration) => {
            if (declaration.parent) {
                if (declaration.parent.nodes.length === 1) {
                    declaration.parent.remove();
                } else {
                    declaration.remove();
                }
            }
        });
    }
}
