export function date(iso?: boolean, d?: Date): string {
	if (!d) {
		d = new Date();
	}
	const day = d.getDate();
	const month = d.getMonth() + 1;
	const year = d.getFullYear();

	const dayStr = (day < 10 ? '0' : '') + day;
	const monthStr = (month < 10 ? '0' : '') + month;
	return iso? `${year}-${monthStr}-${dayStr}` : `${dayStr}-${monthStr}-${year}`;
}

export function time(date?: Date): string {
	if (!date) {
		date = new Date();
	}
	const hour = date.getHours();
	const hourStr = (hour < 10 ? '0' : '') + hour;
	const min  = date.getMinutes();
	const minStr = (min < 10 ? '0' : '') + min;
	const sec  = date.getSeconds();
	const secStr = (sec < 10 ? '0' : '') + sec;
	return `${hourStr}:${minStr}:${secStr}`;
}

export function generateFlatDate(): Date {
	const d = date(true);
	return new Date(`${d}T00:00:00Z`);
}

export function isValidDate(date: string): boolean {
	const timestamp = Date.parse(date);
	// Returns true if timestamp is valid, thus date
	return !isNaN(timestamp);
}
