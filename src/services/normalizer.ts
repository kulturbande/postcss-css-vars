import { Root, Declaration, Rule } from 'postcss';
import { InstructionInterface } from '../types/instruction.interface';

export class Normalizer {
    constructor(private root: Root, private instruction: InstructionInterface) {}

    public normalize() {
        this.createRules();
        this.replaceDeclarations();
        this.cleanupDeclarations();
    }

    private createRules() {
        this.instruction.getRulesToCreate().forEach((rule: Rule) => {
            this.root.append(rule);
        });
    }

    private replaceDeclarations() {
        this.instruction
            .getDeclarationsToChange()
            .forEach((value: { declaration: Declaration; valueToReplace: string }) => {
                value.declaration.value = value.valueToReplace;
            });
    }

    private cleanupDeclarations(): void {
        this.instruction.getDeclarationsToRemove().forEach((declaration: Declaration) => {
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
