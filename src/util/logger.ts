import {promises as fs} from 'fs';
import { Format } from 'logform';
import {resolve} from 'path';
import logger from 'winston';
import dailyRotateFile from  'winston-daily-rotate-file';

import {date, time} from './date';
import {asyncCheckOrMkdir} from './files';
import { getState } from './state';

export default logger;

let profiling = false;

class ErrFormatter implements Format {
	transform(info) {
		if (info?.obj instanceof Error) {
			info.obj = `${info.obj.name}: ${info.obj.message}\n${info.obj.stack}`;
		}
		return info;
	}
}

function errFormater() {
	return new ErrFormatter();
}

export async function readLog(level = 'debug'): Promise<any[]> {
	const log = await fs.readFile(resolve(getState().dataPath, `logs/erin-${date(true)}.log`), 'utf-8');
	const levels = getLogLevels(level);
	return log.split('\n')
		.filter(value => value) // remove empty lines
		.map((line: string) => JSON.parse(line))
		.filter(value => levels.includes(value.level));
}

export function getLogLevels(level: string) {
	const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
	const index = levels.findIndex(val => val === level);
	// This will remove all elements after index
	levels.length = index + 1;
	return levels;
}

export function enableProfiling() {
	profiling = true;
}

export async function configureLogger(dataPath: string, debug: boolean) {
	const consoleLogLevel = debug ? 'debug' : 'info';
	const logDir = resolve(dataPath, 'logs');
	await asyncCheckOrMkdir(logDir);
	const consoleFormat = logger.format.combine(
		logger.format.colorize(),
		logger.format.printf(info => {
			let duration = '';
			if (info.durationMs) duration = ` duration: ${info.durationMs} ms`;
			//Padding if info.level is 4 characters long only
			let level = `${info.level}:`;
			if (info.level.length === 14) level = `${info.level}: `;
			let additional = '';
			if (info?.obj instanceof Error) {
				additional = `${info.obj.name}: ${info.obj.message}\n${info.obj.stack}`;
			} else if (typeof info?.obj !== 'undefined') {
				additional = JSON.stringify(info.obj, null, 2);
			}
			return `${time()} - ${level}${info.service ? ` [${info.service}]`:''} ${info.message}${duration} ${additional}`;
		})
	);
	logger.add(
		new dailyRotateFile({
			filename: 'erin-%DATE%.log',
			dirname: logDir,
			zippedArchive: true,
			level: 'debug',
			handleExceptions: true,
			format: logger.format.combine(
				logger.format.timestamp(),
				errFormater(),
				logger.format.json(),
			)
		})
	);
	logger.add(
		new logger.transports.Console({
			level: consoleLogLevel,
			format: consoleFormat
		})
	);
}

export function profile(func: string) {
	if (profiling) logger.profile(`[Profiling] ${func}`);
}