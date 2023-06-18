import { GlobalDependencies } from '@server/types/shared'
import accountModule from './account'

function modules(globalDependencies: GlobalDependencies) {
	return {
		account: accountModule(globalDependencies)
	}
}

export default modules

export type Modules = ReturnType<typeof modules>
export type ModulesFactory = typeof modules
