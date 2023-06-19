import { ApplicationError } from '@server/utils/application_error'

export class CanNotAccessUserError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.user.can_not_access_user'
	}

	static create({
		message = 'Can not access user',
		code = 'can-not-access-user'
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
