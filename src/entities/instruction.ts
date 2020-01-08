import { InstructionInterface } from './interfaces/instruction.interface';
import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';
import { Declaration, Rule } from 'postcss';
import { RuleDefinitionInterface } from './interfaces/ruleDefinition.interface';
import { RuleCreationInterface } from './interfaces/ruleCreation.interface';
import { DeclarationReplaceInterface } from './interfaces/declarationReplace.interface';
import { VariableEntryInterface } from './interfaces/variableEntry.interface';

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
     * @param variable search for this variable and...
     * @param value ...replace it with this value
     */
    public changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface {
        const replacedWith = new RegExp('var\\(' + variable + '\\)');
        this.replaceDeclarations.push({ declaration, valueToReplace: declaration.value.replace(replacedWith, value) });
        return this;
    }

    /**
     * add a new rule to the CSS
     * @param toCopyDeclaration rule that should be copied
     * @param prefixSelector the selector that should be added to the rule
     * @param variable variable name
     * @param value variable value
     */
    public addRule(ruleDefinition: RuleDefinitionInterface, variable: VariableEntryInterface): InstructionInterface {
        // be aware that the comparison between the whole each entry of the object is another one, that the object itself
        const rule = this.rulesToCreate.find(
            (entry: InternalRuleDefinitionInterface) =>
                entry.definition.container === ruleDefinition.container &&
                entry.definition.prefixSelector === ruleDefinition.prefixSelector &&
                entry.definition.ruleOrigin === ruleDefinition.ruleOrigin
        );

        // the rule was not created?
        if (typeof rule === 'undefined') {
            this.rulesToCreate.push({ definition: ruleDefinition, variables: [variable] });
        } else {
            // add the variable to the previous found rule
            rule.variables.push(variable);
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
        let newRule = rule.definition.ruleOrigin.clone();

        if (rule.definition.prefixSelector) {
            newRule.selector = rule.definition.prefixSelector + ' ' + newRule.selector;
        }

        const variables = [...rule.variables, ...this.globalVariables.all(rule.definition.ruleOrigin)];

        variables.forEach((variable: VariableEntryInterface) => {
            newRule.replaceValues(new RegExp('var\\(' + variable.name + '\\)'), variable.value);
        });

        return newRule;
    }
}
