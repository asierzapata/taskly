/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import type { Provider, ProviderAccountId, UserId } from '../domain/account'

type CreateAccountParameters = {
	userId: UserId
	provider: Provider
	providerAccountId: ProviderAccountId
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function createAccount(
	parameters: CreateAccountParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveAccount({
		_id: repository.generateId(),
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		...parameters
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeCreateAccount(
	parameters: CreateAccountParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	return
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createAccount, type CreateAccountParameters, authorizeCreateAccount }
