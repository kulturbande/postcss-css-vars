import { Root, Declaration, Rule, AtRule } from 'postcss';
import { InstructionInterface } from '../types/instruction.interface';
import { RuleCreationInterface } from '../types/ruleCreation.interface';

export class Normalizer {
    constructor(private root: Root, private instruction: InstructionInterface) {}

    public normalize() {
        this.createRules();
        this.replaceDeclarations();
        this.cleanupDeclarations();
        this.fixIndentation();
    }

    private createRules() {
        this.instruction.getRulesToCreate().forEach((entry: RuleCreationInterface) => {
            if (typeof entry.container !== 'undefined') {
                entry.container.append(entry.rule);
            } else {
                this.root.append(entry.rule);
            }
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

    /**
     * fix indentation of media queries
     */
    private fixIndentation(): void {
        const indentation = '    ';
        const newLine = '\n';

        this.root.walkAtRules((atRule: AtRule) => {
            atRule.walkRules((rule: Rule, index: number) => {
                rule.raws.before = (index === 0 ? newLine : newLine + newLine) + indentation;
                rule.raws.after = newLine + indentation;

                rule.walkDecls((decl: Declaration) => {
                    decl.raws.before = newLine + indentation + indentation;
                });
            });
        });
    }
}
