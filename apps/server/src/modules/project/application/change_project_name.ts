/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { ProjectNotFoundError } from '../domain/errors/project_not_found'
import { UserCanNotAccessProjectError } from '../domain/errors/user_can_not_access_project'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'

type ChangeProjectNameParameters = {
	projectId: string
	name: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function changeProjectName(
	parameters: ChangeProjectNameParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.changeProjectName(parameters.projectId, parameters.name)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeChangeProjectName(
	parameters: ChangeProjectNameParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	const project = await dependencies.repository.getProjectById(
		parameters.projectId
	)

	if (!project) {
		throw ProjectNotFoundError.create({
			value: parameters.projectId
		})
	}

	if (session.getDistinctId() !== project.userId) {
		throw UserCanNotAccessProjectError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	changeProjectName,
	type ChangeProjectNameParameters,
	authorizeChangeProjectName
}
