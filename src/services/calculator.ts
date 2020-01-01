import { VariableInterface } from '../types/variable.interface';
import { Declaration, Rule } from 'postcss';
import { InstructionInterface } from '../types/instruction.interface';
import { Instruction } from '../types/instruction';
import { GlobalVariablesInterface } from '../types/globalVariables.interface';
import { GlobalVariables } from '../types/globalVariables';

export class Calculator {
    private globalVariables: GlobalVariablesInterface;
    private instruction: InstructionInterface;

    constructor(private variables: VariableInterface[]) {}

    public calculateRulePermutations(): InstructionInterface {
        this.globalVariables = new GlobalVariables();
        this.instruction = new Instruction(this.globalVariables);
        this.variables.forEach((variable: VariableInterface) => {
            this.compareDeclarationsOfVariable(variable);
        });

        return this.instruction;
    }

    private compareDeclarationsOfVariable(variable: VariableInterface): void {
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
    ): void {
        const setterRule = this.getParentRule(setterDeclaration);
        const getterRule = this.getParentRule(getterDeclaration);
        const isRootLevelDeclaration = setterRule?.selector === ':root' || setterRule?.selector === 'body';

        // the same rule
        if (setterRule === getterRule) {
            this.instruction.changeDeclaration(getterDeclaration, variable.name, setterDeclaration.value);
            this.instruction.removeDeclaration(setterDeclaration);
            return;
        }

        if (isRootLevelDeclaration) {
            this.globalVariables.add(variable.name, setterDeclaration.value);
            this.instruction.removeDeclaration(setterDeclaration);
        } else {
            this.instruction.addRule(
                getterDeclaration,
                setterRule.selector,
                setterDeclaration.prop,
                setterDeclaration.value
            );
            this.instruction.removeDeclaration(setterDeclaration);
        }

        // use a globale variable if it is set
        if (this.globalVariables.isAvailable(variable.name)) {
            this.instruction.changeDeclaration(
                getterDeclaration,
                variable.name,
                this.globalVariables.get(variable.name)
            );
        }
    }

    private getParentRule(declaration: Declaration): Rule | null {
        if (declaration.parent?.type === 'rule') {
            return declaration.parent;
        }
        return null;
    }
}
