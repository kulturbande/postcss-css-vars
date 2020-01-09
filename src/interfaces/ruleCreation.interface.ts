import { Rule, AtRule, Root } from 'postcss';

export interface RuleCreationInterface {
    rule: Rule;
    container?: Root | AtRule;
}
