/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import { Id } from '../domain/user'
import type { ModuleDependencies } from '../index'

type GetUserByIdParameters = {
	id: Id
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function getUserById(
	parameters: GetUserByIdParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies
	const { id } = parameters

	return repository.getUserById(id)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { getUserById, type GetUserByIdParameters }
