import _ from 'lodash'
import pino from 'pino'
import type { PrettyOptions } from 'pino-pretty'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const LOGGER_SOURCES = {
	WEB_BACKEND: 'web_backend',
	APPLICATION: 'application',
	MONGO_DB: 'mongo_db'
} as const

export const LOGGER_LEVELS = [
	'fatal',
	'error',
	'warn',
	'info',
	'debug',
	'trace',
	'silent'
] as const
type LoggerLevel = (typeof LOGGER_LEVELS)[number]

type LoggerConstructor = {
	name: (typeof LOGGER_SOURCES)[keyof typeof LOGGER_SOURCES]
	enabled: boolean
	level: LoggerLevel
	prettyPrint: boolean | PrettyOptions
}

class Logger {
	logger

	constructor({
		name,
		enabled = true,
		level = 'info',
		prettyPrint = false
	}: LoggerConstructor) {
		if (!name || !_.includes(_.values(LOGGER_SOURCES), name)) {
			throw new Error(`Invalid Logger source: ${name}`)
		}
		const options = {
			name,
			enabled,
			level,
			transport: prettyPrint
				? {
						target: 'pino-pretty',
						options: {
							levelFirst: true,
							colorize: true,
							translateTime: true
						}
				  }
				: undefined
		}
		this.logger = pino(options)
	}

	debug(message: string) {
		return this.logger.debug(message)
	}

	info(message: string) {
		return this.logger.info(message)
	}

	warn(message: string) {
		return this.logger.warn(message)
	}

	error(message: string) {
		return this.logger.error(message)
	}

	fatal(message: string) {
		return this.logger.fatal(message)
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { LOGGER_SOURCES, Logger }
