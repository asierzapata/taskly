import { ApplicationError } from '@server/utils/application_error'

export class TaskNotFoundError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.task.task-not-found'
	}

	static create({
		value,
		message = 'Task not found',
		code = 'task-not-found'
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
