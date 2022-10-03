export interface Daily {
    type?: string;
	amount?: number;
    regress?: number;
    firstcall?: number;
    users?: string;
}

export interface DailyUser extends Daily {
    userid: string;
    dailyType: string;
	date: Date;
}