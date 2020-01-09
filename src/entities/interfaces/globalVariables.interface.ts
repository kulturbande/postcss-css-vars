import { Rule } from 'postcss';
import { VariableEntryInterface } from '../../interfaces/variableEntry.interface';

export interface GlobalVariablesInterface {
    add(name: string, value: string, rule: Rule): void;
    get(name: string, rule: Rule): string | null;
    all(rule: Rule): VariableEntryInterface[];
}
