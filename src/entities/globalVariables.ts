import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';
import { Container, Rule } from 'postcss';
import { VariableEntryInterface } from '../interfaces/variableEntry.interface';

interface VariableContainerEntry {
    container: Container;
    variables: { [name: string]: VariableEntryInterface };
}
export class GlobalVariables implements GlobalVariablesInterface {
    private globalVariables: VariableContainerEntry[] = [];

    add(name: string, value: string, rule: Rule): void {
        this.getVariablesForLevel(rule.parent).variables[name] = { name, value };
    }

    get(variable: string, rule: Rule): string | null {
        if (typeof this.getVariableEntry(variable, rule.parent) !== 'undefined') {
            return this.getVariableEntry(variable, rule.parent).value;
        } else if (typeof this.getVariableEntry(variable, rule.parent?.parent as Container) !== 'undefined') {
            return this.getVariableEntry(variable, rule.parent?.parent as Container).value;
        }
        return null;
    }

    all(rule: Rule): VariableEntryInterface[] {
        let allVariables = this.getVariablesForLevel(rule.parent).variables;
        if (rule.parent.type === 'atrule') {
            allVariables = { ...this.getVariablesForLevel(rule.parent.parent).variables, ...allVariables };
        }
        return Object.values(allVariables);
    }

    private getVariableEntry(variable: string, container: Container): VariableEntryInterface {
        return this.getVariablesForLevel(container).variables[variable];
    }

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
