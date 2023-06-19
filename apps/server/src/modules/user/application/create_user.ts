/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import { Email, FirstName, Id, LastName, Picture } from '../domain/user'
import type { ModuleDependencies } from '../index'

type CreateUserParameters = {
	userId: Id
	email?: Email
	firstName: FirstName
	lastName: LastName
	picture: Picture
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function createUser(
	parameters: CreateUserParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies
	const { userId, email, firstName, lastName, picture } = parameters

	return repository.saveUser({
		_id: userId,
		email,
		firstName,
		lastName,
		picture
	})
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createUser, type CreateUserParameters }
