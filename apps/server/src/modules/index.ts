import { GlobalDependencies } from '@server/types/shared'
import accountModule from './account'
import userModule from './user'

function modules(globalDependencies: GlobalDependencies) {
	return {
		account: accountModule(globalDependencies),
		user: userModule(globalDependencies)
	}
}

export default modules

export type Modules = ReturnType<typeof modules>
export type ModulesFactory = typeof modules
