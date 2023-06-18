/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Provider, ProviderAccountId } from '../domain/account'
import type { ModuleDependencies } from '../index'

type GetAccountByProviderAndProviderAccountIdParameters = {
	provider: Provider
	providerAccountId: ProviderAccountId
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

function getAccountByProviderAndProviderAccountId(
	parameters: GetAccountByProviderAndProviderAccountIdParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.getAccountByProviderAndProviderAccountId(parameters)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	getAccountByProviderAndProviderAccountId,
	type GetAccountByProviderAndProviderAccountIdParameters
}
