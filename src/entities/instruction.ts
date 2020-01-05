import { InstructionInterface } from './interfaces/instruction.interface';
import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';
import { Declaration, Rule } from 'postcss';
import { RuleDefinitionInterface } from './interfaces/ruleDefinition.interface';
import { RuleCreationInterface } from './interfaces/ruleCreation.interface';
import { DeclarationReplaceInterface } from './interfaces/declarationReplace.interface';

export class Instruction implements InstructionInterface {
    private cleanUpDeclarations: Declaration[] = [];
    private replaceDeclarations: DeclarationReplaceInterface[] = [];
    rulesToCreate: { [hash: string]: RuleDefinitionInterface } = {};

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
    public addRule(ruleDefinition: RuleDefinitionInterface): InstructionInterface {
        let hash: string = ruleDefinition.ruleOrigin.selector;
        if (ruleDefinition.container && ruleDefinition.container.type === 'atrule') {
            hash += '_' + ruleDefinition.container.params;
        }
        if (typeof this.rulesToCreate[hash] === 'undefined') {
            this.rulesToCreate[hash] = ruleDefinition;
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
        Object.values(this.rulesToCreate).forEach((ruleDefinition: RuleDefinitionInterface) => {
            rules.push({ rule: this.getNewRule(ruleDefinition), container: ruleDefinition.container });
        });
        return rules;
    }

    /**
     * get the calculated rule
     * @param ruleDefinition values of the new rule
     */
    private getNewRule(ruleDefinition: RuleDefinitionInterface): Rule {
        let newRule = ruleDefinition.ruleOrigin.clone();

        if (ruleDefinition.prefixSelector) {
            newRule.selector = ruleDefinition.prefixSelector + ' ' + newRule.selector;
        }

        this.globalVariables.all().forEach(({ variable, value }) => {
            if (variable !== ruleDefinition.variable) {
                newRule.replaceValues(new RegExp('var\\(' + variable + '\\)'), value);
            }
        });
        newRule.replaceValues(new RegExp('var\\(' + ruleDefinition.variable + '\\)'), ruleDefinition.value);

        return newRule;
    }
}
