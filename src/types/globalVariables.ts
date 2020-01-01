import { GlobalVariablesInterface } from './globalVariables.interface';

export class GlobalVariables implements GlobalVariablesInterface {
    private globalVariables: { [name: string]: { variable: string; value: string } } = {};

    add(variable: string, value: string): void {
        this.globalVariables[variable] = { variable, value };
    }

    get(variable: string): string | null {
        if (this.isAvailable(variable)) {
            return this.globalVariables[variable].value;
        }
    }

    all(): { variable: string; value: string }[] {
        return Object.values(this.globalVariables);
    }

    isAvailable(variable: string): boolean {
        return typeof this.globalVariables[variable] !== 'undefined';
    }
}
