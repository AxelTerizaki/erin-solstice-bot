import { OptionInfo } from './optioninfo';

export interface CommandInfo {
    global?: boolean,
	name: string,
    fullName?: string,
	description?: string,
    aliases?: string[],
    default?: boolean,
    options?: Record<string, OptionInfo>,
}