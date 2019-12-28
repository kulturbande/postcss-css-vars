import { VariableInterface } from './variable.interface';
import { Rule } from 'postcss';

export class Variable implements VariableInterface {
    private setterRules: Rule[] = [];
    private getterRules: Rule[] = [];

    constructor(public name: string) {}

    public addSetterRule(rule: Rule) {
        this.setterRules.push(rule);
    }

    public addGetterRule(rule: Rule) {
        this.getterRules.push(rule);
    }
}
