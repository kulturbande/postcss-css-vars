import { Rule } from 'postcss';
import { VariableEntryInterface } from '../../interfaces/variableEntry.interface';

export interface GlobalVariablesInterface {
    /**
     * add a new variable
     * @param name variable name
     * @param value the value ;-)
     * @param rule current rule
     */
    add(name: string, value: string, rule: Rule): void;

    /**
     * get variable value for current rule
     * @param name variable name
     * @param rule current rule
     */
    get(name: string, rule: Rule): string | null;

    /**
     * get all variables that are in the scope of the given rule
     * @param rule current rule
     */
    all(rule: Rule): VariableEntryInterface[];
}
