/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Provider, ProviderAccountId, UserId } from '../domain/account'
import type { ModuleDependencies } from '../index'

type CreateAccountParameters = {
	userId: UserId
	provider: Provider
	providerAccountId: ProviderAccountId
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function createAccount(
	{ userId, provider, providerAccountId }: CreateAccountParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.saveAccount({
		_id: repository.generateId(),
		userId,
		provider,
		providerAccountId
	})
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { createAccount, type CreateAccountParameters }
