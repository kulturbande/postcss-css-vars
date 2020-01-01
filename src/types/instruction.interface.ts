import { Declaration, Rule } from 'postcss';

export interface InstructionInterface {
    removeDeclaration(declaration: Declaration): InstructionInterface;
    changeDeclaration(declaration: Declaration, variable: string, value: string): InstructionInterface;
    addRule(
        toCopyDeclaration: Declaration,
        prefixSelector: string,
        variable: string,
        value: string
    ): InstructionInterface;

    getDeclarationsToRemove(): Declaration[];
    getDeclarationsToChange(): {
        declaration: Declaration;
        valueToReplace: string;
    }[];
    getRulesToCreate(): Rule[];
}
