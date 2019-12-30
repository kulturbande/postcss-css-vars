import { VariableInterface } from '../types/variable.interface';
import { Root, Declaration } from 'postcss';

export class Calculator {
    constructor(private root: Root, private variables: VariableInterface[]) {}

    public calculateRulePermutations() {
        this.variables.forEach((variable: VariableInterface) => {
            this.compareDeclarationsOfVariable(variable);
        });
    }

    private compareDeclarationsOfVariable(variable: VariableInterface) {
        variable.getSetterDeclarations().forEach((setterDeclaration: Declaration) => {
            variable.getGetterDeclarations().forEach((getterDeclaration: Declaration) => {
                // is the same rule?
                if (setterDeclaration.parent === getterDeclaration.parent) {
                    getterDeclaration.value = setterDeclaration.value;
                    setterDeclaration.remove();
                }
            });
        });
    }
}
