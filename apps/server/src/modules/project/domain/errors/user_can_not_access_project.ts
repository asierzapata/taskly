import { ApplicationError } from '@server/utils/application_error'

export class UserCanNotAccessProjectError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.project.user_can_not_access_project'
	}

	static create({
		message = 'User can not access project',
		code = 'user-can-not-access-project'
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
