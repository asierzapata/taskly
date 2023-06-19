/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'
import { AreaNotFoundError } from '../domain/errors/area_not_found'
import { UserCanNotAccessAreaError } from '../domain/errors/user_can_not_access_area'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'

type ChangeAreaNameParameters = {
	areaId: string
	name: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function changeAreaName(
	parameters: ChangeAreaNameParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.changeAreaName(parameters.areaId, parameters.name)
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeChangeAreaName(
	parameters: ChangeAreaNameParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	if (!session.isAuthenticated()) {
		throw UnauthenticatedError.create()
	}

	const area = await dependencies.repository.getAreaById(parameters.areaId)

	if (!area) {
		throw AreaNotFoundError.create({
			value: parameters.areaId
		})
	}

	if (session.getDistinctId() !== area.userId) {
		throw UserCanNotAccessAreaError.create()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	changeAreaName,
	type ChangeAreaNameParameters,
	authorizeChangeAreaName
}
