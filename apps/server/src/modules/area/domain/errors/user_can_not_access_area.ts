import { ApplicationError } from '@server/utils/application_error'

export class UserCanNotAccessAreaError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.area.user_can_not_access_area'
	}

	static create({
		message = 'User can not access area',
		code = 'user_can_not_access_area'
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
