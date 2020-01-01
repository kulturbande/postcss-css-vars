import { InstructionInterface } from './instruction.interface';
import { GlobalVariablesInterface } from './globalVariables.interface';
import { Declaration, Rule } from 'postcss';

interface RuleDefination {
    copiedRule: Rule;
    prefixSelector: string;
    variable: string;
    value: string;
}

export class Instruction implements InstructionInterface {
    private cleanUpDeclarations: Declaration[] = [];
    private replaceDeclarations: {
        declaration: Declaration;
        valueToReplace: string;
    }[] = [];
    rulesToCreate: RuleDefination[] = [];

    constructor(private globalVariables: GlobalVariablesInterface) {}

    /**
     * mark a declarition to remove
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
     * @param value varaible value
     */
    public addRule(
        toCopyDeclaration: Declaration,
        prefixSelector: string,
        variable: string,
        value: string
    ): InstructionInterface {
        this.rulesToCreate.push({
            copiedRule: toCopyDeclaration.parent.clone() as Rule,
            prefixSelector,
            variable,
            value,
        });
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
    public getDeclarationsToChange(): {
        declaration: Declaration;
        valueToReplace: string;
    }[] {
        return this.replaceDeclarations;
    }

    /**
     * get rules that should be created
     */
    public getRulesToCreate(): Rule[] {
        const rules: Rule[] = [];
        this.rulesToCreate.forEach((ruleDefination: RuleDefination) => {
            rules.push(this.getNewRule(ruleDefination));
        });
        return rules;
    }

    /**
     * get the calculated rule
     * @param ruleDefination values of the new rule
     */
    private getNewRule(ruleDefination: RuleDefination): Rule {
        const newRule = ruleDefination.copiedRule;
        newRule.selector = ruleDefination.prefixSelector + ' ' + newRule.selector;
        this.globalVariables.all().forEach(({ variable, value }) => {
            if (variable !== ruleDefination.variable) {
                newRule.replaceValues(new RegExp('var\\(' + variable + '\\)'), value);
            }
        });
        newRule.replaceValues(new RegExp('var\\(' + ruleDefination.variable + '\\)'), ruleDefination.value);

        return newRule;
    }
}
