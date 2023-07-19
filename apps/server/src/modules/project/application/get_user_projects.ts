/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { type UserId } from '../domain/project'
import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { UserCanNotAccessProjectError } from '../domain/errors/user_can_not_access_project'

type GetUserProjectsParameters = {
	userId: UserId
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	limit: number
	cursor: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getUserProjects(
	parameters: GetUserProjectsParameters,
	dependencies: ModuleDependencies
) {
	return dependencies.repository.getProjectsByUserId(parameters)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetUserProjects(
	parameters: GetUserProjectsParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	if (session.getDistinctId() !== parameters.userId) {
		throw UserCanNotAccessProjectError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	getUserProjects,
	type GetUserProjectsParameters,
	authorizeGetUserProjects
}
