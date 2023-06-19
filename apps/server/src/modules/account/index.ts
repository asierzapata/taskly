import {
	CreateAccountParameters,
	createAccount
} from './application/create_account'
import {
	GetAccountByProviderAndProviderAccountIdParameters,
	getAccountByProviderAndProviderAccountId
} from './application/get_account_by_provider_and_provider_account_id'
import { AccountRepository } from './infrastructure/repository'
import { MongoDBAccountRepository } from './infrastructure/repository/mongodb_account_repository'
import { GlobalDependencies } from '@server/types/shared'

export type ModuleDependencies = {
	repository: AccountRepository
}

const handlers = (globalDependencies: GlobalDependencies) => ({
	createAccount: (parameters: CreateAccountParameters) =>
		createAccount(parameters, {
			...globalDependencies,
			...dependencies(globalDependencies)
		}),
	getAccountByProviderAndProviderAccountId: (
		parameters: GetAccountByProviderAndProviderAccountIdParameters
	) =>
		getAccountByProviderAndProviderAccountId(parameters, {
			...globalDependencies,
			...dependencies(globalDependencies)
		})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBAccountRepository({ db: userDb })
	}
}

export default handlers
