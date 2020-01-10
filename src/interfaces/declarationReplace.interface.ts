import { Declaration } from 'postcss';
import { VariableEntryInterface } from './variableEntry.interface';

export interface DeclarationReplaceInterface {
    declaration: Declaration;
    valueToReplace: string;
    variables: VariableEntryInterface[];
}
