import { Declaration } from 'postcss';

export interface VariableInterface {
    name: string;

    /**
     * add setter declaration (which sets the value of the current variable)
     * @param declaration setter declaration to store
     */
    addSetterDeclaration(declaration: Declaration): void;

    /**
     * add getter declaration (which uses the current variable)
     * @param declaration getter declaration to store
     */
    addGetterDeclaration(declaration: Declaration): void;

    /**
     * get all stored setter declarations
     */
    getSetterDeclarations(): Declaration[];

    /**
     * get all stored getter declarations
     */
    getGetterDeclarations(): Declaration[];
}
