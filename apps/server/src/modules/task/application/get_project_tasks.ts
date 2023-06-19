/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { TaskNotFoundError } from '../domain/errors/task_not_found'
import { UserCanNotAccessTaskError } from '../domain/errors/user_can_not_access_task'

type GetProjectTasksParameters = {
	projectId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	limit: number
	cursor: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getProjectTasks(
	parameters: GetProjectTasksParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.getTasksByProjectId(parameters)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetProjectTasks(
	parameters: GetProjectTasksParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	const { tasks } = await dependencies.repository.getTasksByProjectId({
		projectId: parameters.projectId,
		orderBy: 'name',
		order: 'asc',
		limit: 1,
		cursor: ''
	})

	const task = tasks[0]

	if (!task) {
		throw TaskNotFoundError.create({
			value: parameters.projectId
		})
	}

	if (session.getDistinctId() !== task.userId) {
		throw UserCanNotAccessTaskError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	getProjectTasks,
	type GetProjectTasksParameters,
	authorizeGetProjectTasks
}
