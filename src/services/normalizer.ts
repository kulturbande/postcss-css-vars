import { AtRule, Declaration, Root, Rule } from 'postcss';
import { InstructionInterface } from '../entities/interfaces/instruction.interface';
import { RuleCreationInterface } from '../interfaces/ruleCreation.interface';

export class Normalizer {
    constructor(private root: Root) {}

    /**
     * initialize the CSS changes
     * @param instruction instructions to interpret
     */
    public interpret(instruction: InstructionInterface) {
        this.createRules(instruction);
        this.replaceDeclarations(instruction);
        this.cleanupDeclarations(instruction);
        this.fixIndentation();
    }

    /**
     * create new rules
     */
    private createRules(instruction: InstructionInterface) {
        instruction.getRulesToCreate().forEach((entry: RuleCreationInterface) => {
            if (typeof entry.container !== 'undefined') {
                entry.container.append(entry.rule);
            } else {
                this.root.append(entry.rule);
            }
        });
    }

    /**
     * replace variables in given declaration
     */
    private replaceDeclarations(instruction: InstructionInterface) {
        instruction.getDeclarationsToChange().forEach((value: { declaration: Declaration; valueToReplace: string }) => {
            value.declaration.value = value.valueToReplace;
        });
    }

    /**
     * remove declarations
     */
    private cleanupDeclarations(instruction: InstructionInterface): void {
        instruction.getDeclarationsToRemove().forEach((declaration: Declaration) => {
            if (declaration.parent) {
                if (declaration.parent.nodes?.length === 1) {
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
