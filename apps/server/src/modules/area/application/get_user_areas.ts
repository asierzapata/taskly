/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { type UserId } from '../domain/area'
import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { UserCanNotAccessAreaError } from '../domain/errors/user_can_not_access_area'

type GetUserAreasParameters = {
	userId: UserId
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	limit: number
	cursor: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getUserAreas(
	parameters: GetUserAreasParameters,
	dependencies: ModuleDependencies
) {
	return dependencies.repository.getAreasByUserId(parameters)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetUserAreas(
	parameters: GetUserAreasParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	if (session.getDistinctId() !== parameters.userId) {
		throw UserCanNotAccessAreaError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { getUserAreas, type GetUserAreasParameters, authorizeGetUserAreas }
