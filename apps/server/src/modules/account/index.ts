import { createHandler } from '../shared/handler_factory'
import {
	authorizeCreateAccount,
	createAccount
} from './application/create_account'
import {
	authorizeGetAccountByProviderAndProviderAccountId,
	getAccountByProviderAndProviderAccountId
} from './application/get_account_by_provider_and_provider_account_id'
import { AccountRepository } from './infrastructure/repository'
import { MongoDBAccountRepository } from './infrastructure/repository/mongodb_account_repository'
import { GlobalDependencies } from '@server/shared/types'

export type ModuleDependencies = {
	repository: AccountRepository
}

const handlers = (globalDependencies: GlobalDependencies) => ({
	createAccount: createHandler({
		authorize: authorizeCreateAccount,
		handler: createAccount,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	getAccountByProviderAndProviderAccountId: createHandler({
		authorize: authorizeGetAccountByProviderAndProviderAccountId,
		handler: getAccountByProviderAndProviderAccountId,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBAccountRepository({ db: userDb })
	}
}

export default handlers
