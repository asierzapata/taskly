import { ApplicationError } from '@server/utils/application_error'

export class UnauthenticatedError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.authentication.unauthenticated'
	}

	static create({
		message = 'Unauthenticated',
		code = 'unauthenticated'
	}: {
		message?: string
		code?: string
	} = {}) {
		return this.Operational({
			errorName: this.errorName,
			message,
			code
		})
	}
}
