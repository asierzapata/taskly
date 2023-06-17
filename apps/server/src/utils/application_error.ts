import { v4 as uuidv4 } from 'uuid'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const ERROR_TYPES = {
	PROGRAMMER: 'programmer',
	OPERATIONAL: 'operational'
} as const

type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES]

type ApplicationErrorAttributes = {
	code: string
	message: string
	stack: string | undefined
}

type ApplicationErrorMeta = Record<string, unknown>

class ApplicationError extends Error {
	static types = ERROR_TYPES

	id: string
	type: ErrorType
	version: number
	errorName: string
	occurredOn: string
	attributes: ApplicationErrorAttributes
	meta: ApplicationErrorMeta

	constructor({
		id = uuidv4(),
		type = ApplicationError.types.OPERATIONAL,
		occurredOn = new Date().toISOString(),
		version = 1,
		errorName,
		message,
		code,
		error
	}: {
		id?: string
		type?: ErrorType
		occurredOn?: string
		version?: number
		errorName: string
		message: string
		code: string
		error: Error
	}) {
		super(message)
		this.id = id
		this.type = type
		this.errorName = errorName
		this.version = version
		this.occurredOn = occurredOn
		this.attributes = {
			code,
			message,
			stack: error.stack
		}
		this.meta = {}
	}

	// Named constructors
	// ------------------

	static Operational({
		errorName,
		message,
		code
	}: {
		errorName: string
		message: string
		code: string
	}) {
		const error = new Error(message)

		return new this({
			type: ApplicationError.types.OPERATIONAL,
			errorName,
			message,
			code,
			error
		})
	}

	static Programmer({
		errorName,
		message,
		code
	}: {
		errorName: string
		message: string
		code: string
	}) {
		const error = new Error(message)

		return new this({
			type: ApplicationError.types.PROGRAMMER,
			errorName,
			message,
			code,
			error
		})
	}

	// Public methods
	// --------------

	addMetadata(meta: ApplicationErrorMeta) {
		this.meta = {
			...this.meta,
			...meta
		}
	}
}

export { ApplicationError }
