import { Rule, Root, AtRule } from 'postcss';

export interface RuleDefinationInterface {
    ruleOrigin: Rule;
    container?: Root | AtRule;
    prefixSelector?: string;
    variable: string;
    value: string;
}
