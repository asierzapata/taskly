import { GlobalDependencies } from '@server/types/shared'
import accountModule from './account'
import userModule from './user'
import areaModule from './area'
import projectModule from './project'

function modules(globalDependencies: GlobalDependencies) {
	return {
		account: accountModule(globalDependencies),
		user: userModule(globalDependencies),
		area: areaModule(globalDependencies),
		project: projectModule(globalDependencies)
	}
}

export default modules

export type Modules = ReturnType<typeof modules>
export type ModulesFactory = typeof modules
