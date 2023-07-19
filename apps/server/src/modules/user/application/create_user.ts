/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import {
	type Email,
	type FirstName,
	type Id,
	type LastName,
	type Picture
} from '../domain/user'

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
	{ userId, ...parameters }: CreateUserParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveUser({
		_id: userId,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

function authorizeCreateUser(
	_parameters: CreateUserParameters,
	_dependencies: ModuleDependencies,
	_session: Session
) {
	return
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createUser, type CreateUserParameters, authorizeCreateUser }
