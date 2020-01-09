import { AtRule, Root, Rule } from 'postcss';

export interface RuleCreationInterface {
    rule: Rule;
    container?: Root | AtRule;
}
