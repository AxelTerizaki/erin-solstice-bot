export type GuildLevelMap = Map<string, LevelMap>

export type LevelMap = Map<string, UserLevelData>

export interface UserLevelData {
	lastMessageDate: Date,
	numberOfMessages: number
}