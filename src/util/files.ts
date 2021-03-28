import {readFile, stat, Stats, writeFile} from 'fs';
import {mkdirp} from 'fs-extra';
import {resolve} from 'path';
import {promisify} from 'util';

const passThroughFunction = (fn: any, args: any) => {
	if(!Array.isArray(args)) args = [args];
	return promisify(fn)(...args);
};


export const asyncExists = (file: string) => passThroughFunction(stat, file);
export const asyncReadFile = (...args: any) => passThroughFunction(readFile, args);
export const asyncMkdirp = (...args: any) => passThroughFunction(mkdirp, args);

export function asyncStat(...args: any): Promise<Stats> {
	return passThroughFunction(stat, args);
}

export const asyncWriteFile = (...args: any) => passThroughFunction(writeFile, args);


export async function asyncCheckOrMkdir(dir: string) {
	try {
		const resolvedDir = resolve(dir);
		if (!await asyncExists(resolvedDir)) await asyncMkdirp(resolvedDir);
	} catch(err) {
		throw `${dir} is unreachable. Check if drive is connected or permissions to that directory are correct : ${err}`;
	}
}
