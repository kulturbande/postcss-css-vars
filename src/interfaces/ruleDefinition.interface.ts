import { AtRule, Root, Rule } from 'postcss';

export interface RuleDefinitionInterface {
    ruleOrigin: Rule;
    container?: Root | AtRule;
    prefixSelector?: string;
}
