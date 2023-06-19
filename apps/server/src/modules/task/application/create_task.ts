/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { AreaId, Name, NoteId, UserId } from '../domain/task'
import type { ModuleDependencies } from '../index'

type CreateTaskParameters = {
	userId: UserId
	projectId: AreaId
	noteId: NoteId
	name: Name
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function createTask(
	parameters: CreateTaskParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveTask({
		_id: repository.generateId(),
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeCreateTask(
	parameters: CreateTaskParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createTask, type CreateTaskParameters, authorizeCreateTask }
