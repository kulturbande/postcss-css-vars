import { Declaration, Rule } from 'postcss';
import { GetterDeclarationInterface } from './getterDeclaration.interface';

export interface VariableInterface {
    name: string;

    /**
     * add setter declaration (which sets the value of the current variable)
     * @param declaration setter declaration to store
     */
    addSetterDeclaration(declaration: Declaration): void;

    /**
     * add getter declaration (which uses the current variable)
     * @param getterDeclaration getter declaration to store
     */
    addGetterDeclaration(getterDeclaration: GetterDeclarationInterface): void;

    /**
     * get all stored setter declarations
     */
    getSetterDeclarations(): Declaration[];

    /**
     * get all stored getter declarations
     */
    getGetterDeclarations(): GetterDeclarationInterface[];

    /**
     * get all stored getter rules
     */
    getGetterRules(): Rule[];
}
