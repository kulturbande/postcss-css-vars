export interface GlobalVariablesInterface {
    add(variable: string, value: string, level?: string): void;
    get(variable: string, level?: string): string | null;
    all(level?: string): { variable: string; value: string }[];
    isAvailable(variable: string, level?: string): boolean;
}
