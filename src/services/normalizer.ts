import { CalculatorResultInterface } from '../types/calculatorResult.interface';
import { Root, Declaration, Rule } from 'postcss';

export class Normalizer {
    constructor(private root: Root, private calculatorResult: CalculatorResultInterface) {}

    public normalize() {
        this.cleanupDeclarations();
        this.replaceDeclarations();
        this.createRules();
    }

    private createRules() {
        this.calculatorResult.rulesToCreate.forEach((rule: Rule) => {
            this.root.append(rule);
        });
    }

    private replaceDeclarations() {
        this.calculatorResult.replaceDeclarations.forEach(
            (value: { declaration: Declaration; valueToReplace: string }) => {
                value.declaration.value = value.valueToReplace;
            }
        );
    }

    private cleanupDeclarations(): void {
        this.calculatorResult.cleanUpDeclarations.forEach((declaration: Declaration) => {
            if (declaration.parent) {
                if (declaration.parent.nodes.length === 1) {
                    declaration.parent.remove(); // remove the rule, if only one declaration is left
                } else {
                    declaration.remove();
                }
            }
        });
    }
}
