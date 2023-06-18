import { ApplicationError } from '@server/utils/application_error'
/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

class InvalidInputStringError extends ApplicationError {
	static get errorName() {
		return 'api.1.error.invalid_input_string'
	}

	static create({
		message = 'Invalid Input String',
		code = 'invalid-input-string'
	} = {}) {
		return this.Operational({
			errorName: this.errorName,
			message,
			code
		})
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { InvalidInputStringError }
