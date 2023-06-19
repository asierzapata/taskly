import _ from 'lodash'
import Chance from 'chance'
import { ApplicationError } from '@server/utils/application_error'

const chance = new Chance()

/* ====================================================== */
/*                       Exceptions                       */
/* ====================================================== */

class InvalidSessionTypeError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.invalid_session_type'
	}

	static create({
		value,
		message = 'Invalid session type',
		code = 'invalid-session-type'
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

const SESSION_TYPES = {
	UNAUTHENTICATED: 'unauthenticated',
	AUTHENTICATED: 'authenticated',
	ADMIN: 'admin'
} as const

const types = _.values(SESSION_TYPES)

export type SessionTypeValue = (typeof types)[number]

class SessionType {
	_value: (typeof types)[number]

	constructor(value = '') {
		if (!_.includes(types, value)) {
			throw InvalidSessionTypeError.create({
				value
			})
		}
		this._value = value as (typeof types)[number]
	}

	// Named constructors
	// ------------------

	static random() {
		return new this(chance.pickone(types))
	}

	static unauthenticated() {
		return new this(SESSION_TYPES.UNAUTHENTICATED)
	}

	static authenticated() {
		return new this(SESSION_TYPES.AUTHENTICATED)
	}

	// Methods
	// -------

	isUnauthenticated() {
		return this._value === SESSION_TYPES.UNAUTHENTICATED
	}

	isUser() {
		return this.isAdmin() || this.isAuthenticated()
	}

	isAuthenticated() {
		return this._value === SESSION_TYPES.AUTHENTICATED
	}

	isAdmin() {
		return this._value === SESSION_TYPES.ADMIN
	}

	toValue() {
		return this._value
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SessionType, InvalidSessionTypeError }
