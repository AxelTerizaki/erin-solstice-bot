export interface OptionInfo {
    type: number,
    name: string,
    description?: string,
    required?: boolean,
    choices?: Record<string, unknown>
}