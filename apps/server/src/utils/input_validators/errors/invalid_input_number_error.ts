/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

import { ApplicationError } from '@server/utils/application_error'

class InvalidInputNumberError extends ApplicationError {
	static get errorName() {
		return 'api.1.error.invalid_input_number'
	}

	static create({
		message = 'Invalid Input Number',
		code = 'invalid-input-number'
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

export { InvalidInputNumberError }
