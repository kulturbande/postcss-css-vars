import { VariableInterface } from '../entities/interfaces/variable.interface';
import { Declaration, Rule, AtRule } from 'postcss';
import { InstructionInterface } from '../entities/interfaces/instruction.interface';
import { Instruction } from '../entities/instruction';
import { GlobalVariablesInterface } from '../entities/interfaces/globalVariables.interface';
import { GlobalVariables } from '../entities/globalVariables';
import { RuleDefinitionInterface } from '../entities/interfaces/ruleDefinition.interface';

export class Calculator {
    private globalVariables: GlobalVariablesInterface;
    private instruction: InstructionInterface;

    constructor(private variables: VariableInterface[]) {
        this.globalVariables = new GlobalVariables();
        this.instruction = new Instruction(this.globalVariables);
    }

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
        const setterRule = this.getRule(setterDeclaration);
        const getterRule = this.getRule(getterDeclaration);
        const setterAtRule = this.getAtRule(setterRule);
        const getterAtRule = this.getAtRule(getterRule);

        const isRootLevelSetterDeclaration = setterRule.selector === ':root' || setterRule.selector === 'body';

        // the same rule
        if (setterRule === getterRule) {
            this.instruction.changeDeclaration(getterDeclaration, variable.name, setterDeclaration.value);
            this.instruction.removeDeclaration(setterDeclaration);
            return;
        }

        if (isRootLevelSetterDeclaration) {
            // on root - level
            if (setterAtRule === null) {
                // only store the variables
                this.globalVariables.add(variable.name, setterDeclaration.value);
            } else if (getterAtRule === null) {
                // getter is on root level and needs to create a child in the given media query
                const rule: RuleDefinitionInterface = {
                    ruleOrigin: getterRule,
                    variable: setterDeclaration.prop,
                    value: setterDeclaration.value,
                    container: setterAtRule,
                };

                this.globalVariables.add(variable.name, setterDeclaration.value, setterAtRule.params);
                this.instruction.addRule(rule);
            }
        } else {
            // the setter has an own rule
            const rule: RuleDefinitionInterface = {
                ruleOrigin: getterRule,
                prefixSelector: setterRule.selector,
                variable: setterDeclaration.prop,
                value: setterDeclaration.value,
            };

            this.instruction.addRule(rule);
        }

        // remove the setter
        this.instruction.removeDeclaration(setterDeclaration);

        // add global variables to getter declarations
        let wasReplaced = false;
        if (getterAtRule) {
            wasReplaced = this.replaceWithGlobalVariable(getterDeclaration, variable.name, getterAtRule.params);
        }
        if (!wasReplaced) {
            this.replaceWithGlobalVariable(getterDeclaration, variable.name);
        }
    }

    /**
     * replace with global variable
     * @param getterDeclaration getter declaration that should be replaced
     * @param variableName name of the replaced variable
     * @param level media query level
     */
    private replaceWithGlobalVariable(getterDeclaration: Declaration, variableName: string, level?: string): boolean {
        if (this.globalVariables.isAvailable(variableName, level)) {
            const value = this.globalVariables.get(variableName, level);
            if (value) {
                this.instruction.changeDeclaration(getterDeclaration, variableName, value);
                return true;
            }
        }
        return false;
    }

    /**
     * get current rule
     * @param declaration get the rule from the given declaration
     */
    private getRule(declaration: Declaration): Rule {
        if (declaration.parent?.type === 'rule') {
            return declaration.parent;
        }
        throw new Error("Can't find parent for " + declaration.toString());
    }

    private getAtRule(rule: Rule): AtRule | null {
        if (rule.parent.type === 'atrule') {
            return rule.parent;
        }
        return null;
    }
}
