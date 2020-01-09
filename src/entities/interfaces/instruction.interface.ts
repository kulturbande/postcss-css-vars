import { Declaration } from 'postcss';
import { RuleDefinitionInterface } from '../../interfaces/ruleDefinition.interface';
import { RuleCreationInterface } from '../../interfaces/ruleCreation.interface';
import { DeclarationReplaceInterface } from '../../interfaces/declarationReplace.interface';
import { VariableEntryInterface } from '../../interfaces/variableEntry.interface';

export interface InstructionInterface {
    removeDeclaration(declaration: Declaration): InstructionInterface;
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;
    addRule(ruleDefinition: RuleDefinitionInterface, variable: VariableEntryInterface): InstructionInterface;

    getDeclarationsToRemove(): Declaration[];
    getDeclarationsToChange(): DeclarationReplaceInterface[];
    getRulesToCreate(): RuleCreationInterface[];
}
