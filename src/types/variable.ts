import { VariableInterface } from './variable.interface';
import { Declaration } from 'postcss';

export class Variable implements VariableInterface {
    private setterDeclarations: Declaration[] = [];
    private getterDeclarations: Declaration[] = [];

    constructor(public name: string) {}

    public addSetterDeclaration(declaration: Declaration) {
        this.setterDeclarations.push(declaration);
    }

    public addGetterDeclaration(declaration: Declaration) {
        this.getterDeclarations.push(declaration);
    }

    public getSetterDeclarations(): Declaration[] {
        return this.setterDeclarations;
    }

    public getGetterDeclarations(): Declaration[] {
        return this.getterDeclarations;
    }
}
