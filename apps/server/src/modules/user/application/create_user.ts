/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { Email, FirstName, Id, LastName, Picture } from '../domain/user'

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

async function createUser(
	parameters: CreateUserParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveUser({
		_id: repository.generateId(),
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeCreateUser(
	parameters: CreateUserParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	return
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createUser, type CreateUserParameters, authorizeCreateUser }
