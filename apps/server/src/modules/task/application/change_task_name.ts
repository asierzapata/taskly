/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { TaskNotFoundError } from '../domain/errors/task_not_found'
import { UserCanNotAccessTaskError } from '../domain/errors/user_can_not_access_task'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'

type ChangeTaskNameParameters = {
	taskId: string
	name: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function changeTaskName(
	parameters: ChangeTaskNameParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.changeTaskName(parameters.taskId, parameters.name)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeChangeTaskName(
	parameters: ChangeTaskNameParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	const task = await dependencies.repository.getTaskById(parameters.taskId)

	if (!task) {
		throw TaskNotFoundError.create({
			value: parameters.taskId
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
	changeTaskName,
	type ChangeTaskNameParameters,
	authorizeChangeTaskName
}
