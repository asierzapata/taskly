import _ from 'lodash'

import { uuid } from '@server/services/uuid'
import { ApplicationError } from '@server/utils/application_error'

import { SessionType, SessionTypeValue } from './session_type'
import { SessionSource, SessionSourceValue } from './session_source'
import {
	SessionAuthorizationStatus,
	SessionAuthorizationStatusValue
} from './session_authorization_status'
import { SessionDevice, SessionDeviceValue } from './session_device'

/* ====================================================== */
/*                       Exceptions                       */
/* ====================================================== */

class InvalidSessionError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.invalid_session'
	}

	static create({
		message = 'Invalid session',
		code = 'invalid-session',
		value
	}: {
		message?: string
		code?: string
		value: unknown
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

class Session {
	_value: {
		id: string
		type: SessionType
		distinctId: string
		registeredAt?: Date
		source?: SessionSource
		device?: SessionDevice
		authorizationStatus?: SessionAuthorizationStatus
	}

	constructor({
		id = uuid(),
		type,
		distinctId,
		registeredAt,
		source,
		device = {},
		authorizationStatus = SessionAuthorizationStatus.unauthorized().toValue()
	}: {
		id?: string
		type: SessionTypeValue
		distinctId: string
		registeredAt?: Date
		source?: SessionSourceValue
		device?: SessionDeviceValue
		authorizationStatus?: SessionAuthorizationStatusValue
	}) {
		const data = {
			id,
			type: new SessionType(type),
			distinctId,
			source: new SessionSource(source),
			device: new SessionDevice(device),
			authorizationStatus: new SessionAuthorizationStatus(authorizationStatus),
			registeredAt
		}
		if (new SessionType(type).isUser() && _.isEmpty(distinctId)) {
			throw InvalidSessionError.create({ value: data })
		}
		this._value = data
	}

	// Named constructors
	// ------------------

	static unauthenticated({
		id = uuid(),
		device,
		source
	}: {
		id?: string
		device?: SessionDeviceValue
		source?: SessionSourceValue
	} = {}) {
		return new this({
			id,
			type: SessionType.unauthenticated().toValue(),
			distinctId: '',
			source,
			device,
			authorizationStatus: SessionAuthorizationStatus.unauthorized().toValue()
		})
	}

	static user({
		distinctId,
		device = SessionDevice.undetectable().toValue(),
		source
	}: {
		distinctId: string
		device?: SessionDeviceValue
		source?: SessionSourceValue
	}) {
		return new this({
			type: SessionType.authenticated().toValue(),
			distinctId,
			source,
			device,
			authorizationStatus: SessionAuthorizationStatus.unauthorized().toValue()
		})
	}

	static admin({
		distinctId,
		device = SessionDevice.undetectable().toValue(),
		source
	}: {
		distinctId: string
		device?: SessionDeviceValue
		source?: SessionSourceValue
	}) {
		return new this({
			type: SessionType.admin().toValue(),
			distinctId,
			source,
			device,
			authorizationStatus: SessionAuthorizationStatus.unauthorized().toValue()
		})
	}

	static fromEvent(session: Session) {
		return new this({
			type: session._value.type.toValue(),
			distinctId: session._value.distinctId,
			registeredAt: session._value.registeredAt,
			source: SessionSource.event().toValue(),
			device: session._value.device?.toValue()
		})
	}

	static random({
		type = SessionType.authenticated().toValue(),
		distinctId = new SessionType(type).isUser() ? uuid() : '',
		registeredAt = new SessionType(type).isUser() ? new Date() : undefined,
		source = SessionSource.commandOrQuery().toValue(),
		device = SessionDevice.random().toValue()
	}: {
		type?: SessionTypeValue
		distinctId?: string
		registeredAt?: Date
		source?: SessionSourceValue
		device?: SessionDeviceValue
	} = {}) {
		return new this({
			type,
			distinctId,
			registeredAt,
			source,
			device
		})
	}

	// Methods
	// -------

	isAuthenticated() {
		return this._value.type.isAuthenticated()
	}

	isAdmin() {
		return this._value.type.isAdmin()
	}

	getType() {
		return this._value.type
	}

	getDistinctId() {
		return this._value.distinctId
	}

	isFromEvent() {
		return this._value.source?.isEvent() ?? false
	}

	isUserWithId(userId: string) {
		return this.getDistinctId() === userId
	}

	// Methods - Device
	// ----------------

	getDevice() {
		return this._value.device
	}

	// Methods - Authorization
	// -----------------------

	isUnauthorized() {
		return this._value.authorizationStatus?.isUnauthorized() || true
	}

	isAuthorizing() {
		return this._value.authorizationStatus?.isAuthorizing() || false
	}

	isAuthorized() {
		return this._value.authorizationStatus?.isAuthorized() || false
	}

	setAsAuthorizing() {
		this._value.authorizationStatus = SessionAuthorizationStatus.authorizing()
	}

	setAsAuthorized() {
		this._value.authorizationStatus = SessionAuthorizationStatus.authorized()
	}

	getAuthorizationStatus() {
		return this._value.authorizationStatus
	}
}

/* ====================================================== */
/*                        Public API                      */
/* ====================================================== */

export { Session, InvalidSessionError }
