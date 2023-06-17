import { ApplicationError } from '@server/utils/application_error'
import { NextFunction, Request, Response } from 'express'

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

// Authenticated
// -------------

class UnauthenticatedError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.unauthenticated'
	}

	static create({
		message = 'Unauthenticated',
		code = 'unauthenticated'
	} = {}) {
		return this.Operational({
			errorName: this.errorName,
			message,
			code
		})
	}
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.session?.getType().isUnauthenticated()) {
		const error = UnauthenticatedError.create()
		error.addMetadata({
			errorStatusMapping: { [UnauthenticatedError.name]: 403 }
		})
		return next(error)
	}
	return next()
}

// Admin
// -----

class NotAdminError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.not_admin'
	}

	static create({ message = 'Not admin', code = 'not-admin' } = {}) {
		return this.Operational({
			errorName: this.errorName,
			message,
			code
		})
	}
}

function isAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.session?.getType().isAdmin()) {
		const error = NotAdminError.create()
		error.addMetadata({ errorStatusMapping: { [NotAdminError.name]: 403 } })
		return next(error)
	}
	return next()
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

module.exports = {
	isAuthenticated,
	isAdmin
}
