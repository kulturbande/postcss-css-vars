import { VariableInterface } from './interfaces/variable.interface';
import { Declaration } from 'postcss';

export class Variable implements VariableInterface {
    private setterDeclarations: Declaration[] = [];
    private getterDeclarations: Declaration[] = [];

    constructor(public name: string) {}

    /**
     * add setter declaration (which sets the value of the current variable)
     * @param declaration setter declaration to store
     */
    public addSetterDeclaration(declaration: Declaration) {
        this.setterDeclarations.push(declaration);
    }

    /**
     * add getter declaration (which uses the current variable)
     * @param declaration getter declaration to store
     */
    public addGetterDeclaration(declaration: Declaration) {
        this.getterDeclarations.push(declaration);
    }

    /**
     * get all stored setter declarations
     */
    public getSetterDeclarations(): Declaration[] {
        return this.setterDeclarations;
    }

    /**
     * get all stored getter declarations
     */
    public getGetterDeclarations(): Declaration[] {
        return this.getterDeclarations;
    }
}
