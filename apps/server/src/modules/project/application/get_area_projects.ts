/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { ProjectNotFoundError } from '../domain/errors/project_not_found'
import { UserCanNotAccessProjectError } from '../domain/errors/user_can_not_access_project'

type GetAreaProjectsParameters = {
	areaId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	limit: number
	cursor: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getAreaProjects(
	parameters: GetAreaProjectsParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.getProjectsByAreaId(parameters)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetAreaProjects(
	parameters: GetAreaProjectsParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	const { projects } = await dependencies.repository.getProjectsByAreaId({
		areaId: parameters.areaId,
		orderBy: 'name',
		order: 'asc',
		limit: 1,
		cursor: ''
	})

	const project = projects[0]

	if (!project) {
		throw ProjectNotFoundError.create({
			value: parameters.areaId
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
	getAreaProjects,
	type GetAreaProjectsParameters,
	authorizeGetAreaProjects
}
