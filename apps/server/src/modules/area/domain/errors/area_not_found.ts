import { ApplicationError } from '@server/utils/application_error'

export class AreaNotFoundError extends ApplicationError {
	static get errorName() {
		return 'taskly.1.error.area.area-not-found'
	}

	static create({
		value,
		message = 'Area not found',
		code = 'area-not-found'
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
