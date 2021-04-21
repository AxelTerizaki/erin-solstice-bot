export function date(iso?: boolean): string {
	const d = new Date();
	const day = d.getDate();
	const month = d.getMonth() + 1;
	const year = d.getFullYear();

	const dayStr = (day < 10 ? '0' : '') + day;
	const monthStr = (month < 10 ? '0' : '') + month;
	return iso? `${year}-${monthStr}-${dayStr}` : `${dayStr}-${monthStr}-${year}`;
}

export function time(): string {
	const date = new Date();
	const hour = date.getHours();
	const hourStr = (hour < 10 ? '0' : '') + hour;
	const min  = date.getMinutes();
	const minStr = (min < 10 ? '0' : '') + min;
	const sec  = date.getSeconds();
	const secStr = (sec < 10 ? '0' : '') + sec;
	return `${hourStr}:${minStr}:${secStr}`;
}
