/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

import { UnauthenticatedError } from '@server/services/authentication/errors/unauthenticated_error'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { UserId } from '../domain/area'
import type { ModuleDependencies } from '../index'

type CreateAreaParameters = {
	userId: UserId
	name: string
	description: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function createArea(
	parameters: CreateAreaParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveArea({
		_id: repository.generateId(),
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeCreateArea(
	parameters: CreateAreaParameters,
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

export { createArea, type CreateAreaParameters, authorizeCreateArea }
