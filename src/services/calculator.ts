import { VariableInterface } from '../types/variable.interface';
import { Root, Declaration, Rule } from 'postcss';

export class Calculator {
    private globalVariables: { [name: string]: string } = {};

    constructor(private root: Root, private variables: VariableInterface[]) {}

    public calculateRulePermutations() {
        this.variables.forEach((variable: VariableInterface) => {
            this.compareDeclarationsOfVariable(variable);
        });
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

        if (setterRule?.selector === ':root') {
            // root level declarations
            this.globalVariables[variable.name] = setterDeclaration.value;
            this.removeDeclartaion(setterDeclaration);
        }

        if (setterRule === getterRule) {
            getterDeclaration.value = setterDeclaration.value;
            this.removeDeclartaion(setterDeclaration);
        }

        if (typeof this.globalVariables[variable.name] !== 'undefined') {
            getterDeclaration.value = this.globalVariables[variable.name];
        }
    }

    private removeDeclartaion(declaration: Declaration) {
        if (declaration.parent) {
            if (declaration.parent.nodes.length === 1) {
                declaration.parent.remove();
            } else {
                declaration.remove();
            }
        }
    }

    private getParentRule(declaration: Declaration): Rule | null {
        if (declaration.parent.type === 'rule') {
            return declaration.parent;
        }
        return null;
    }
}
