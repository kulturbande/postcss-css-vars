import { Declaration, Rule } from 'postcss';
import { DeclarationReplaceInterface } from '../interfaces/declarationReplace.interface';
import { RuleCreationInterface } from '../interfaces/ruleCreation.interface';
import { RuleDefinitionInterface } from '../interfaces/ruleDefinition.interface';
import { VariableEntryInterface } from '../interfaces/variableEntry.interface';
import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';
import { InstructionInterface } from './interfaces/instruction.interface';

interface InternalRuleDefinitionInterface {
    definition: RuleDefinitionInterface;
    variables: VariableEntryInterface[];
}

export class Instruction implements InstructionInterface {
    private cleanUpDeclarations: Declaration[] = [];
    private replaceDeclarations: DeclarationReplaceInterface[] = [];
    private rulesToCreate: InternalRuleDefinitionInterface[] = [];

    constructor(private globalVariables: GlobalVariablesInterface) {}

    /**
     * mark a declaration to remove
     * @param declaration declaration to remove
     */
    public removeDeclaration(declaration: Declaration): InstructionInterface {
        if (this.cleanUpDeclarations.indexOf(declaration) === -1) {
            this.cleanUpDeclarations.push(declaration);
        }
        return this;
    }

    /**
     * change this declaration
     * @param declaration change given declaration
     * @param variable search for this variable
     */
    public changeDeclaration(declaration: Declaration, variable: VariableEntryInterface): InstructionInterface {
        /**
         * generate the new value of the declaration
         * @param valueToReplace previous value
         * @param variables all given variables
         */
        const generateReplacedValue = (valueToReplace: string, variables: VariableEntryInterface[]): string => {
            variables.forEach((entry: VariableEntryInterface) => {
                valueToReplace = valueToReplace.replace(new RegExp('var\\(' + entry.name + '\\)'), entry.value);
            });
            return valueToReplace;
        };

        const replaceableDeclaration: DeclarationReplaceInterface | undefined = this.replaceDeclarations.find(
            (entry: DeclarationReplaceInterface) => {
                return entry.declaration === declaration;
            }
        );

        // is the declaration already stored?
        if (replaceableDeclaration) {
            const alreadyStoredVariable: VariableEntryInterface | undefined = replaceableDeclaration.variables.find(
                (entry: VariableEntryInterface) => entry.name === variable.name
            );

            // add the variable if it isn't available
            if (typeof alreadyStoredVariable === 'undefined') {
                replaceableDeclaration.variables.push(variable);
            } else {
                // update the value if it was already set
                alreadyStoredVariable.value = variable.value;
            }

            replaceableDeclaration.valueToReplace = generateReplacedValue(
                replaceableDeclaration.declaration.value,
                replaceableDeclaration.variables
            );
        } else {
            const variables = [variable];
            this.replaceDeclarations.push({
                declaration,
                valueToReplace: generateReplacedValue(declaration.value, variables),
                variables,
            });
        }

        return this;
    }

    /**
     * add a new rule to the CSS
     * @param ruleDefinition rule information which are necessary to create a new one
     * @param variable variable that should be replaced
     */
    public addRule(ruleDefinition: RuleDefinitionInterface, variables: VariableEntryInterface[]): InstructionInterface {
        // be aware that the comparison between the whole each entry of the object is another one, that the object
        // itself
        // TODO: maybe use Ramda or lodash
        const rule = this.rulesToCreate.find(
            (entry: InternalRuleDefinitionInterface) =>
                entry.definition.container === ruleDefinition.container &&
                JSON.stringify(entry.definition.prefixSelectors) === JSON.stringify(ruleDefinition.prefixSelectors) &&
                entry.definition.ruleOrigin === ruleDefinition.ruleOrigin
        );

        // the rule was not created?
        if (typeof rule === 'undefined') {
            this.rulesToCreate.push({ definition: ruleDefinition, variables });
        } else {
            // add the variable to the previous found rule
            variables.forEach(variable => rule.variables.push(variable));
        }

        return this;
    }

    /**
     * get declaration that should be removed
     */
    public getDeclarationsToRemove(): Declaration[] {
        return this.cleanUpDeclarations;
    }

    /**
     * get declarations and and their new values that should be changed
     */
    public getDeclarationsToChange(): DeclarationReplaceInterface[] {
        return this.replaceDeclarations;
    }

    /**
     * get rules that should be created
     */
    public getRulesToCreate(): RuleCreationInterface[] {
        const rules: RuleCreationInterface[] = [];
        this.rulesToCreate.forEach((entry: InternalRuleDefinitionInterface) => {
            rules.push({ rule: this.getNewRule(entry), container: entry.definition.container });
        });
        return rules;
    }

    /**
     * get the calculated rule
     * @param rule values of the new rule
     */
    private getNewRule(rule: InternalRuleDefinitionInterface): Rule {
        const newRule = rule.definition.ruleOrigin.clone();

        if (rule.definition.prefixSelectors) {
            newRule.selector = rule.definition.prefixSelectors
                .map(prefix => {
                    return prefix + ' ' + newRule.selector;
                })
                .join(',\n');
        }

        const variables = [...rule.variables, ...this.globalVariables.all(rule.definition.ruleOrigin)];

        variables.forEach((variable: VariableEntryInterface) => {
            newRule.replaceValues(new RegExp('var\\(' + variable.name + '\\)'), variable.value);
        });

        return newRule;
    }
}
