import { AtRule, Declaration, Rule } from 'postcss';
import { GlobalVariables } from '../entities/globalVariables';
import { Instruction } from '../entities/instruction';
import { GlobalVariablesInterface } from '../entities/interfaces/globalVariables.interface';
import { InstructionInterface } from '../entities/interfaces/instruction.interface';
import { VariableInterface } from '../entities/interfaces/variable.interface';
import { RuleDefinitionInterface } from '../interfaces/ruleDefinition.interface';
import { VariableEntryInterface } from '../interfaces/variableEntry.interface';

interface RulePermutationInterface {
    ruleOrigin: Rule;
    settings: {
        selector: string;
        variables: VariableEntryInterface[];
    }[];
}

export class Calculator {
    private globalVariables: GlobalVariablesInterface;
    private instruction: InstructionInterface;
    private rulePermutations: RulePermutationInterface[] = [];

    constructor(private variables: VariableInterface[]) {
        this.globalVariables = new GlobalVariables();
        this.instruction = new Instruction(this.globalVariables);
    }

    /**
     * iterate over all variables and create instructions to change later the CSS
     */
    public getInstructions(): InstructionInterface {
        this.globalVariables = new GlobalVariables();
        this.instruction = new Instruction(this.globalVariables);
        this.rulePermutations = [];

        this.variables.forEach((variable: VariableInterface) => {
            variable.getSetterDeclarations().forEach((setterDeclaration: Declaration) => {
                variable.getGetterDeclarations().forEach((getterDeclaration: Declaration) => {
                    this.compareDeclarations(variable, setterDeclaration, getterDeclaration);
                });
            });
        });

        this.rulePermutations.forEach(permutation => this.addRulePermutation(permutation));

        return this.instruction;
    }

    /**
     * create new permutation rule (necessary for multiple setters for one getter)
     * @param permutation permutation to add
     */
    private addRulePermutation(permutation: RulePermutationInterface) {
        if (permutation.settings.length < 2) {
            return;
        }

        const moveSelectorPositions = (items: string[], position: number): void => {
            items.splice(position + 1, 0, items.splice(position, 1)[0]);
        };

        const getGeneratedSelectors = (items: string[], maxSelectorPermutation: number = 3): string[] => {
            if (items.length < maxSelectorPermutation) {
                maxSelectorPermutation = items.length;
            }

            const maxIterations = maxSelectorPermutation * ((maxSelectorPermutation + 1) / 2);
            const generatedResult: string[] = [];

            for (let i = 1; i < maxIterations; i++) {
                generatedResult.push(items.join(' '));
                moveSelectorPositions(items, i % (maxSelectorPermutation - 1));
            }
            return generatedResult;
        };

        const selectors: string[] = [];
        const rule: RuleDefinitionInterface = {
            ruleOrigin: permutation.ruleOrigin,
        };
        let variables: VariableEntryInterface[] = [];

        permutation.settings.forEach(entry => {
            variables = variables.concat(entry.variables);
            selectors.push(entry.selector);
        });

        rule.prefixSelectors = getGeneratedSelectors(selectors);
        this.instruction.addRule(rule, variables);
    }

    /**
     * compare given declarations with each other and create instructions if necessary
     * @param variable current variable
     * @param setterDeclaration given setter declaration
     * @param getterDeclaration current getter declaration
     */
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
            this.instruction.changeDeclaration(getterDeclaration, {
                name: variable.name,
                value: setterDeclaration.value,
            });
            this.instruction.removeDeclaration(setterDeclaration);
            return;
        }

        if (isRootLevelSetterDeclaration) {
            // on root - level
            this.globalVariables.add(variable.name, setterDeclaration.value, setterRule);

            // create a new rule if the getter is on root level and the setter is in a media query
            if (getterAtRule === null && setterAtRule) {
                const rule: RuleDefinitionInterface = {
                    container: setterAtRule,
                    ruleOrigin: getterRule,
                };
                this.instruction.addRule(rule, [{ name: setterDeclaration.prop, value: setterDeclaration.value }]);
            }
        } else if (this.isVariableSetterNotInRule(getterRule, variable)) {
            // the setter has an own rule
            const rule: RuleDefinitionInterface = {
                prefixSelectors: [setterRule.selector],
                ruleOrigin: getterRule,
            };
            const ruleVariable: VariableEntryInterface = {
                name: setterDeclaration.prop,
                value: setterDeclaration.value,
            };
            this.instruction.addRule(rule, [ruleVariable]);

            if (this.hasRuleAnotherVariableGetter(variable, getterRule)) {
                const previousPermutation = this.rulePermutations.find(entry => entry.ruleOrigin === getterRule);
                const setting = {
                    selector: setterRule.selector,
                    variables: [ruleVariable],
                };

                // oh god, this is so ugly
                // TODO: create a helper for these push find mechanic
                if (previousPermutation) {
                    const previousIncludedSetting = previousPermutation.settings.find(
                        item => item.selector === setting.selector
                    );

                    if (previousIncludedSetting) {
                        previousIncludedSetting.variables.push(ruleVariable);
                    } else {
                        previousPermutation.settings.push(setting);
                    }
                } else {
                    this.rulePermutations.push({
                        ruleOrigin: rule.ruleOrigin,
                        settings: [setting],
                    });
                }
            }
        }

        // remove the setter
        this.instruction.removeDeclaration(setterDeclaration);

        // add global variables to getter declarations
        this.replaceWithGlobalVariable(getterDeclaration, variable.name);
    }

    /**
     * found out if another variable also has this rule as a getter
     * @param variable current variable
     * @param rule getter rule
     */
    private hasRuleAnotherVariableGetter(variable: VariableInterface, rule: Rule): boolean {
        const foundVariable = this.variables.find(
            (entry: VariableInterface) => entry !== variable && entry.getGetterRules().indexOf(rule) !== -1
        );
        return typeof foundVariable !== 'undefined';
    }

    /**
     *
     * @param rule getter rule that needs to be inspect
     * @param variable variable name
     */
    private isVariableSetterNotInRule(rule: Rule, variable: VariableInterface): boolean {
        const setterDeclaration = variable
            .getSetterDeclarations()
            .find((declaration: Declaration) => declaration.parent === rule);

        return typeof setterDeclaration === 'undefined';
    }

    /**
     * replace with global variable
     * @param getterDeclaration getter declaration that should be replaced
     * @param variableName name of the replaced variable
     * @param level media query level
     */
    private replaceWithGlobalVariable(getterDeclaration: Declaration, variableName: string): boolean {
        const value = this.globalVariables.get(variableName, this.getRule(getterDeclaration));
        if (value) {
            this.instruction.changeDeclaration(getterDeclaration, { name: variableName, value });
            return true;
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

    /**
     * get at rule container if available
     * @param rule current rule
     */
    private getAtRule(rule: Rule): AtRule | null {
        if (rule.parent.type === 'atrule') {
            return rule.parent;
        }
        return null;
    }
}
