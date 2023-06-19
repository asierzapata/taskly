import { ApplicationError } from '@server/utils/application_error'

export class ProjectNotFoundError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.project.project-not-found'
	}

	static create({
		value,
		message = 'Project not found',
		code = 'project-not-found'
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
