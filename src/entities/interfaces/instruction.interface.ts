import { Declaration } from 'postcss';
import { RuleDefinitionInterface } from './ruleDefinition.interface';
import { RuleCreationInterface } from './ruleCreation.interface';
import { DeclarationReplaceInterface } from './declarationReplace.interface';

export interface InstructionInterface {
    removeDeclaration(declaration: Declaration): InstructionInterface;
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;
    addRule(ruleDefinition: RuleDefinitionInterface): InstructionInterface;

    getDeclarationsToRemove(): Declaration[];
    getDeclarationsToChange(): DeclarationReplaceInterface[];
    getRulesToCreate(): RuleCreationInterface[];
}
