/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { AreaId, Description, Name, UserId } from '../domain/project'
import type { ModuleDependencies } from '../index'

type CreateProjectParameters = {
	userId: UserId
	areaId: AreaId
	name: Name
	description: Description
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function createProject(
	parameters: CreateProjectParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveProject({
		_id: repository.generateId(),
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeCreateProject(
	parameters: CreateProjectParameters,
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

export { createProject, type CreateProjectParameters, authorizeCreateProject }
