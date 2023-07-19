/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { type UserId } from '../domain/task'
import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { UserCanNotAccessTaskError } from '../domain/errors/user_can_not_access_task'

type GetUserTasksParameters = {
	userId: UserId
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	limit: number
	cursor: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getUserTasks(
	parameters: GetUserTasksParameters,
	dependencies: ModuleDependencies
) {
	return dependencies.repository.getTasksByUserId(parameters)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetUserTasks(
	parameters: GetUserTasksParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	if (session.getDistinctId() !== parameters.userId) {
		throw UserCanNotAccessTaskError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { getUserTasks, type GetUserTasksParameters, authorizeGetUserTasks }
