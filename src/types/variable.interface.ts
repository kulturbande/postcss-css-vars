import { Declaration } from 'postcss';

export interface VariableInterface {
    name: string;

    addSetterDeclaration(declaration: Declaration): void;
    addGetterDeclaration(declaration: Declaration): void;

    getSetterDeclarations(): Declaration[];
    getGetterDeclarations(): Declaration[];
}
