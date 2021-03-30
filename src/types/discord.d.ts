export interface SlashCommand {
	name: string,
	description: string,
	options?: SlashOption[]
}

interface SlashOption {
	name: string,
	description: string,
	type: number,
	required: boolean,
	choices: SlashChoice[]
}

interface SlashChoice {
	name: string,
	value: string
}