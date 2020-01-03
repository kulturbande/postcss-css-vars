import { Declaration } from 'postcss';
import { RuleDefinitionInterface } from './ruleDefinition.interface';
import { RuleCreationInterface } from './ruleCreation.interface';

export interface InstructionInterface {
    removeDeclaration(declaration: Declaration): InstructionInterface;
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;
    addRule(ruleDefinition: RuleDefinitionInterface): InstructionInterface;

    getDeclarationsToRemove(): Declaration[];
    getDeclarationsToChange(): {
        declaration: Declaration;
        valueToReplace: string;
    }[];
    getRulesToCreate(): RuleCreationInterface[];
}
