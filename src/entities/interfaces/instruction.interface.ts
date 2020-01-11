import { Declaration } from 'postcss';
import { DeclarationReplaceInterface } from '../../interfaces/declarationReplace.interface';
import { RuleCreationInterface } from '../../interfaces/ruleCreation.interface';
import { RuleDefinitionInterface } from '../../interfaces/ruleDefinition.interface';
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
     * @param variable search for this variable
     */
    changeDeclaration(declaration: Declaration, variable: VariableEntryInterface): InstructionInterface;

    /**
     * add a new rule to the CSS
     * @param ruleDefinition rule information which are necessary to create a new one
     * @param variable variable that should be replaced
     */
    addRule(ruleDefinition: RuleDefinitionInterface, variables: VariableEntryInterface[]): InstructionInterface;

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
