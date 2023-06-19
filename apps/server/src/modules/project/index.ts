import type { ProjectRepository } from './infrastructure/repository'
import { MongoDBProjectRepository } from './infrastructure/repository/mongodb_project_repository'
import type { GlobalDependencies } from '@server/types/shared'

export type ModuleDependencies = {
	repository: ProjectRepository
}

import {
	authorizeChangeProjectDescription,
	changeProjectDescription
} from './application/change_project_description'
import {
	authorizeChangeProjectName,
	changeProjectName
} from './application/change_project_name'
import {
	authorizeCreateProject,
	createProject
} from './application/create_project'
import {
	getUserProjects,
	authorizeGetUserProjects
} from './application/get_user_projects'
import { createHandler } from '../shared/handler_factory'

const handlers = (globalDependencies: GlobalDependencies) => ({
	// Queries
	getUserProjects: createHandler({
		authorize: authorizeGetUserProjects,
		handler: getUserProjects,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	// Commands
	createProject: createHandler({
		authorize: authorizeCreateProject,
		handler: createProject,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	changeProjectName: createHandler({
		authorize: authorizeChangeProjectName,
		handler: changeProjectName,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	changeProjectDescription: createHandler({
		authorize: authorizeChangeProjectDescription,
		handler: changeProjectDescription,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBProjectRepository({ db: userDb })
	}
}

export default handlers
