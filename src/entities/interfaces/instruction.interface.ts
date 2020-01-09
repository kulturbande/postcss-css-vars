import { Declaration } from 'postcss';
import { RuleDefinitionInterface } from '../../interfaces/ruleDefinition.interface';
import { RuleCreationInterface } from '../../interfaces/ruleCreation.interface';
import { DeclarationReplaceInterface } from '../../interfaces/declarationReplace.interface';
import { VariableEntryInterface } from '../../interfaces/variableEntry.interface';

export interface InstructionInterface {
    /**
     * mark a declaration to remove
     * @param declaration declaration to remove
     */
    removeDeclaration(declaration: Declaration): InstructionInterface;

    /**
     * change this declaration
     * @param declaration change given declaration
     * @param variable search for this variable and...
     * @param value ...replace it with this value
     */
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;

    /**
     * add a new rule to the CSS
     * @param ruleDefinition rule information which are necessary to create a new one
     * @param variable variable that should be replaced
     */
    addRule(ruleDefinition: RuleDefinitionInterface, variable: VariableEntryInterface): InstructionInterface;

    /**
     * get declaration that should be removed
     */
    getDeclarationsToRemove(): Declaration[];

    /**
     * get declarations and and their new values that should be changed
     */
    getDeclarationsToChange(): DeclarationReplaceInterface[];

    /**
     * get rules that should be created
     */
    getRulesToCreate(): RuleCreationInterface[];
}
