/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { CanNotAccessUserError } from '../domain/errors/can_not_access_user'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'

type GetUserByIdParameters = {
	userId: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getUserById(
	parameters: GetUserByIdParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.getUserById(parameters.userId)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetUserById(
	parameters: GetUserByIdParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	if (session.getDistinctId() !== parameters.userId) {
		throw CanNotAccessUserError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { getUserById, type GetUserByIdParameters, authorizeGetUserById }
