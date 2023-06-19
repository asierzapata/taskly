/* ====================================================== */
/*                        Domain                          */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { Session } from '@server/services/authentication'
import type { ModuleDependencies } from '../index'
import type { Provider, ProviderAccountId } from '../domain/account'

type GetAccountByProviderAndProviderAccountIdParameters = {
	provider: Provider
	providerAccountId: ProviderAccountId
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getAccountByProviderAndProviderAccountId(
	parameters: GetAccountByProviderAndProviderAccountIdParameters,
	dependencies: ModuleDependencies
) {
	const { repository } = dependencies

	return repository.getAccountByProviderAndProviderAccountId({
		provider: parameters.provider,
		providerAccountId: parameters.providerAccountId
	})
}

/* ====================================================== */
/*                       Authorize                        */
/* ====================================================== */

async function authorizeGetAccountByProviderAndProviderAccountId(
	parameters: GetAccountByProviderAndProviderAccountIdParameters,
	dependencies: ModuleDependencies,
	session: Session
) {
	return
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export {
	getAccountByProviderAndProviderAccountId,
	type GetAccountByProviderAndProviderAccountIdParameters,
	authorizeGetAccountByProviderAndProviderAccountId
}
