import type { AreaRepository } from './infrastructure/repository'
import { MongoDBAreaRepository } from './infrastructure/repository/mongodb_area_repository'
import type { GlobalDependencies } from '@server/shared/types'

export type ModuleDependencies = {
	repository: AreaRepository
}

import {
	authorizeChangeAreaDescription,
	changeAreaDescription
} from './application/change_area_description'
import {
	authorizeChangeAreaName,
	changeAreaName
} from './application/change_area_name'
import { authorizeCreateArea, createArea } from './application/create_area'
import {
	getUserAreas,
	authorizeGetUserAreas
} from './application/get_user_areas'
import { createHandler } from '../shared/handler_factory'

const handlers = (globalDependencies: GlobalDependencies) => ({
	// Queries
	getUserAreas: createHandler({
		authorize: authorizeGetUserAreas,
		handler: getUserAreas,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	// Commands
	createArea: createHandler({
		authorize: authorizeCreateArea,
		handler: createArea,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	changeAreaName: createHandler({
		authorize: authorizeChangeAreaName,
		handler: changeAreaName,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	changeAreaDescription: createHandler({
		authorize: authorizeChangeAreaDescription,
		handler: changeAreaDescription,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBAreaRepository({ db: userDb })
	}
}

export default handlers
