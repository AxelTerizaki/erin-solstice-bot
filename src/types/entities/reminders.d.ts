export interface Reminder {
    id?: number;
	user_id?: string;
	name?: string;
	content?: string;
	created_at?: Date;
	remind_at?: Date;
	channel_id?: string;
}