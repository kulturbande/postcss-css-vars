import { Container, Rule } from 'postcss';
import { VariableEntryInterface } from '../interfaces/variableEntry.interface';
import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';

interface VariableContainerEntry {
    container: Container;
    variables: { [name: string]: VariableEntryInterface };
}
export class GlobalVariables implements GlobalVariablesInterface {
    private globalVariables: VariableContainerEntry[] = [];

    /**
     * add a new variable
     * @param name variable name
     * @param value the value ;-)
     * @param rule current rule
     */
    public add(name: string, value: string, rule: Rule): void {
        this.getVariablesForLevel(rule.parent).variables[name] = { name, value };
    }

    /**
     * get variable value for current rule
     * @param name variable name
     * @param rule current rule
     */
    public get(name: string, rule: Rule): string | null {
        if (typeof this.getVariableEntry(name, rule.parent) !== 'undefined') {
            return this.getVariableEntry(name, rule.parent).value;
        } else if (typeof this.getVariableEntry(name, rule.parent?.parent as Container) !== 'undefined') {
            return this.getVariableEntry(name, rule.parent?.parent as Container).value;
        }
        return null;
    }

    /**
     * get all variables that are in the scope of the given rule
     * @param rule current rule
     */
    public all(rule: Rule): VariableEntryInterface[] {
        let allVariables = this.getVariablesForLevel(rule.parent).variables;
        if (rule.parent.type === 'atrule') {
            allVariables = { ...this.getVariablesForLevel(rule.parent.parent).variables, ...allVariables };
        }
        return Object.values(allVariables);
    }

    /**
     * get the variable for given container
     * @param variable name of variable
     * @param container container (atrule/ root)
     */
    private getVariableEntry(variable: string, container: Container): VariableEntryInterface {
        return this.getVariablesForLevel(container).variables[variable];
    }

    /**
     * get all variables and their container
     * @param container root or atrule
     */
    private getVariablesForLevel(container: Container): VariableContainerEntry {
        let containerEntry: VariableContainerEntry | undefined = this.globalVariables.find(
            (entry: VariableContainerEntry) => entry.container === container
        );

        if (typeof containerEntry === 'undefined') {
            containerEntry = { container, variables: {} };
            this.globalVariables.push(containerEntry);
        }
        return containerEntry;
    }
}
