import { Rule, Root, AtRule } from 'postcss';

export interface RuleDefinitionInterface {
    ruleOrigin: Rule;
    container?: Root | AtRule;
    prefixSelector?: string;
}
