import { GlobalVariablesInterface } from './interfaces/globalVariables.interface';

export class GlobalVariables implements GlobalVariablesInterface {
    private globalVariables: { [level: string]: { [name: string]: { variable: string; value: string } } } = {};

    constructor() {
        this.globalVariables['root'] = {};
    }

    add(variable: string, value: string, level?: string): void {
        this.getVariablesForLevel(level)[variable] = { variable, value };
    }

    get(variable: string, level?: string): string | null {
        if (this.isAvailable(variable, level)) {
            return this.getVariablesForLevel(level)[variable].value;
        }
    }

    all(level?: string): { variable: string; value: string }[] {
        let allVariables = this.getVariablesForLevel();
        if (level) {
            allVariables = { ...this.getVariablesForLevel(level), ...allVariables };
        }
        return Object.values(allVariables);
    }

    isAvailable(variable: string, level: string = 'root'): boolean {
        return typeof this.getVariablesForLevel(level)[variable] !== 'undefined';
    }

    private getVariablesForLevel(level?: string) {
        if (level) {
            if (typeof this.globalVariables[level] === 'undefined') {
                this.globalVariables[level] = {};
            }
            return this.globalVariables[level];
        }
        return this.globalVariables['root'];
    }
}
