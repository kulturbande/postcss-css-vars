import { Declaration } from 'postcss';

export interface GetterDeclarationInterface {
    declaration: Declaration;
    defaultValue: string | undefined;
}
