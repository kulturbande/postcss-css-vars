import { Declaration } from 'postcss';
import { RuleDefinationInterface } from './ruleDefinition.interface';
import { RuleCreationInterface } from './ruleCreation.interface';

export interface InstructionInterface {
    removeDeclaration(declaration: Declaration): InstructionInterface;
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;
    addRule(ruleDefination: RuleDefinationInterface): InstructionInterface;

    getDeclarationsToRemove(): Declaration[];
    getDeclarationsToChange(): {
        declaration: Declaration;
        valueToReplace: string;
    }[];
    getRulesToCreate(): RuleCreationInterface[];
}
