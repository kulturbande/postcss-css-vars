import { Declaration, Rule } from 'postcss';

export interface CalculatorResultInterface {
    cleanUpDeclarations: Declaration[];
    replaceDeclarations: {
        declaration: Declaration;
        valueToReplace: string;
    }[];
    rulesToCreate: Rule[];
}
