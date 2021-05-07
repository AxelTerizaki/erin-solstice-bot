import {constants as FSConstants, PathLike, promises as fs} from 'fs';
import {mkdirp} from 'fs-extra';
import {resolve} from 'path';

export async function asyncExists(file: PathLike, write = false): Promise<boolean> {
	try {
		await fs.access(file, write ? FSConstants.W_OK:FSConstants.F_OK);
		return true;
	} catch (err) {
		return false;
	}
}

export async function asyncCheckOrMkdir(dir: string) {
	try {
		const resolvedDir = resolve(dir);
		if (!await asyncExists(resolvedDir)) await mkdirp(resolvedDir);
	} catch(err) {
		throw `${dir} is unreachable and cannot be created. \
		Check if drive is connected or permissions to that directory are correct : \
		${err} \
		(Windows users might want to create it manually).`;
	}
}
