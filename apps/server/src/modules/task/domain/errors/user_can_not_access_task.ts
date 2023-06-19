import { ApplicationError } from '@server/utils/application_error'

export class UserCanNotAccessTaskError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.task.user_can_not_access_task'
	}

	static create({
		message = 'User can not access task',
		code = 'user-can-not-access-task'
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
