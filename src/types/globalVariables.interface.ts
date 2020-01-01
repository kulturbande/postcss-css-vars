export interface GlobalVariablesInterface {
    add(variable: string, value: string): void;
    get(variable: string): string | null;
    all(): { variable: string; value: string }[];
    isAvailable(variable: string): boolean;
}
