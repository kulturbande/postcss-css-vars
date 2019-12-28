import { Rule } from 'postcss';

export interface VariableInterface {
    name: string;

    addSetterRule(rule: Rule): void;
    addGetterRule(rule: Rule): void;
}
