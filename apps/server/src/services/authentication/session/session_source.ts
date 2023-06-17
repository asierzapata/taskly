import _ from 'lodash'
import Chance from 'chance'

const chance = new Chance()

import { ApplicationError } from '@server/utils/application_error'

/* ====================================================== */
/*                       Exceptions                       */
/* ====================================================== */

class InvalidSessionSourceError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.invalid_session_source'
	}

	static create({
		value,
		message = 'Invalid session source',
		code = 'invalid-session-source'
	}: {
		value: unknown
		message?: string
		code?: string
	}) {
		return this.Operational({
			errorName: this.errorName,
			message: `${value} - ${message}`,
			code
		})
	}
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SESSION_SOURCES = {
	HTTP_REQUEST: 'httpRequest',
	COMMAND_OR_QUERY: 'commandOrQuery',
	EVENT: 'event'
} as const

const sources = _.values(SESSION_SOURCES)

export type SessionSourceValue = (typeof sources)[number]

class SessionSource {
	_value: (typeof sources)[number]

	constructor(value: unknown) {
		if (!_.includes(sources, value)) {
			throw InvalidSessionSourceError.create({
				value
			})
		}
		this._value = value as (typeof sources)[number]
	}

	// Named constructors
	// ------------------

	static random() {
		return new this(chance.pickone(sources))
	}

	static httpRequest() {
		return new this(SESSION_SOURCES.HTTP_REQUEST)
	}

	static commandOrQuery() {
		return new this(SESSION_SOURCES.COMMAND_OR_QUERY)
	}

	static event() {
		return new this(SESSION_SOURCES.EVENT)
	}

	// Methods
	// -------

	isHttpRequest() {
		return this._value === SESSION_SOURCES.HTTP_REQUEST
	}

	isCommandOrQuery() {
		return this._value === SESSION_SOURCES.COMMAND_OR_QUERY
	}

	isEvent() {
		return this._value === SESSION_SOURCES.EVENT
	}

	toValue() {
		return this._value
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SessionSource, InvalidSessionSourceError }
