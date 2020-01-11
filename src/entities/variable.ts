import { Declaration, Rule } from 'postcss';
import { VariableInterface } from './interfaces/variable.interface';

export class Variable implements VariableInterface {
    private setterDeclarations: Declaration[] = [];
    private getterDeclarations: Declaration[] = [];
    private getterRules: Rule[] = [];

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
        const rule: Rule = declaration.parent as Rule;
        if (this.getterRules.indexOf(rule) === -1) {
            this.getterRules.push(rule);
        }
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

    /**
     * get all stored getter rules
     */
    public getGetterRules(): Rule[] {
        return this.getterRules;
    }
}
