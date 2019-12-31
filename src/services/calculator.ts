import { VariableInterface } from '../types/variable.interface';
import { Root, Declaration, Rule, rule } from 'postcss';
import { CalculatorResultInterface } from '../types/calculatorResult.interface';

export class Calculator {
    private globalVariables: { [name: string]: string } = {};
    private result: CalculatorResultInterface;

    constructor(private variables: VariableInterface[]) {
        this.result = {
            cleanUpDeclarations: [],
            replaceDeclarations: [],
            rulesToCreate: [],
        };
    }

    public calculateRulePermutations(): CalculatorResultInterface {
        this.variables.forEach((variable: VariableInterface) => {
            this.compareDeclarationsOfVariable(variable);
        });

        return this.result;
    }

    private compareDeclarationsOfVariable(variable: VariableInterface) {
        variable.getSetterDeclarations().forEach((setterDeclaration: Declaration) => {
            variable.getGetterDeclarations().forEach((getterDeclaration: Declaration) => {
                this.compareDeclarations(variable, setterDeclaration, getterDeclaration);
            });
        });
    }

    private compareDeclarations(
        variable: VariableInterface,
        setterDeclaration: Declaration,
        getterDeclaration: Declaration
    ) {
        const setterRule = this.getParentRule(setterDeclaration);
        const getterRule = this.getParentRule(getterDeclaration);
        const isRootLevelDeclaration = setterRule?.selector === ':root' || setterRule?.selector === 'body';

        // the same rule
        if (setterRule === getterRule) {
            this.replaceDeclaration(getterDeclaration, variable.name, setterDeclaration.value);
            this.removeDeclartaion(setterDeclaration);
            return;
        }

        if (isRootLevelDeclaration) {
            this.globalVariables[variable.name] = setterDeclaration.value;
            this.removeDeclartaion(setterDeclaration);
        } else {
            this.createRule(getterDeclaration, setterRule.selector, setterDeclaration);
            this.removeDeclartaion(setterDeclaration);
        }

        // use a globale variable if it is set
        if (typeof this.globalVariables[variable.name] !== 'undefined') {
            this.replaceDeclaration(getterDeclaration, variable.name, this.globalVariables[variable.name]);
        }
    }

    private removeDeclartaion(declaration: Declaration) {
        if (this.result.cleanUpDeclarations.indexOf(declaration) === -1) {
            this.result.cleanUpDeclarations.push(declaration);
        }
    }

    private replaceDeclaration(getterDeclaration: Declaration, variable: string, value: string) {
        const replacedWith = new RegExp('var\\(' + variable + '\\)');
        this.result.replaceDeclarations.push({
            declaration: getterDeclaration,
            valueToReplace: getterDeclaration.value.replace(replacedWith, value),
        });
    }

    private createRule(toCopyDeclaration: Declaration, setterSelector: string, setterDeclaration: Declaration) {
        const newRule = toCopyDeclaration.parent.clone() as Rule;
        newRule.selector = setterSelector + ' ' + newRule.selector;
        newRule.replaceValues(new RegExp('var\\(' + setterDeclaration.prop + '\\)'), setterDeclaration.value);
        this.result.rulesToCreate.push(newRule);
    }

    private getParentRule(declaration: Declaration): Rule | null {
        if (declaration.parent?.type === 'rule') {
            return declaration.parent;
        }
        return null;
    }
}
