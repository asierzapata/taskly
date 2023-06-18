/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

import { ApplicationError } from '@server/utils/application_error'

class InvalidInputBooleanError extends ApplicationError {
	static get errorName() {
		return 'api.1.error.invalid_input_boolean'
	}

	static create({
		message = 'Invalid Input Boolean',
		code = 'invalid-input-boolean'
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

export { InvalidInputBooleanError }
