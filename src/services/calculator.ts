import { VariableInterface } from '../entities/interfaces/variable.interface';
import { Declaration, Rule, AtRule } from 'postcss';
import { InstructionInterface } from '../entities/interfaces/instruction.interface';
import { Instruction } from '../entities/instruction';
import { GlobalVariablesInterface } from '../entities/interfaces/globalVariables.interface';
import { GlobalVariables } from '../entities/globalVariables';
import { RuleDefinationInterface } from '../entities/interfaces/ruleDefinition.interface';

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

        // the same rule
        if (setterRule === getterRule) {
            this.instruction.changeDeclaration(getterDeclaration, variable.name, setterDeclaration.value);
            this.instruction.removeDeclaration(setterDeclaration);
            return;
        }

        if (this.isRootLevelDeclaration(setterRule, 'root')) {
            this.globalVariables.add(variable.name, setterDeclaration.value);
        } else if (this.isRootLevelDeclaration(setterRule, 'atrule')) {
            const atRule = setterRule.parent as AtRule;
            const rule: RuleDefinationInterface = {
                ruleOrigin: getterRule,
                variable: setterDeclaration.prop,
                value: setterDeclaration.value,
                container: atRule,
            };

            this.globalVariables.add(variable.name, setterDeclaration.value, atRule.params);
            this.instruction.addRule(rule);
        } else {
            const rule: RuleDefinationInterface = {
                ruleOrigin: getterRule,
                prefixSelector: setterRule.selector,
                variable: setterDeclaration.prop,
                value: setterDeclaration.value,
            };

            this.instruction.addRule(rule);
        }

        this.instruction.removeDeclaration(setterDeclaration);

        // use a globale variable if it is set
        if (this.globalVariables.isAvailable(variable.name)) {
            this.instruction.changeDeclaration(
                getterDeclaration,
                variable.name,
                this.globalVariables.get(variable.name)
            );
        }
    }

    /**
     * find out if this is a root/atrule - level declaration
     * @param rule setter rule which should be parsed
     * @param type root or atrule - type
     */
    private isRootLevelDeclaration(rule: Rule, type: string): boolean {
        if (rule?.parent?.type !== type) {
            return false;
        }
        return rule?.selector === ':root' || rule?.selector === 'body';
    }

    /**
     * get current rule
     * @param declaration get the rule from the given declaration
     */
    private getParentRule(declaration: Declaration): Rule | null {
        if (declaration.parent?.type === 'rule') {
            return declaration.parent;
        }
        return null;
    }
}
