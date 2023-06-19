import type { TaskRepository } from './infrastructure/repository'
import { MongoDBTaskRepository } from './infrastructure/repository/mongodb_task_repository'
import type { GlobalDependencies } from '@server/types/shared'

export type ModuleDependencies = {
	repository: TaskRepository
}

import {
	authorizeChangeTaskName,
	changeTaskName
} from './application/change_task_name'
import { authorizeCreateTask, createTask } from './application/create_task'
import {
	getUserTasks,
	authorizeGetUserTasks
} from './application/get_user_tasks'
import { createHandler } from '../shared/handler_factory'

const handlers = (globalDependencies: GlobalDependencies) => ({
	// Queries
	getUserTasks: createHandler({
		authorize: authorizeGetUserTasks,
		handler: getUserTasks,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	// Commands
	createTask: createHandler({
		authorize: authorizeCreateTask,
		handler: createTask,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	changeTaskName: createHandler({
		authorize: authorizeChangeTaskName,
		handler: changeTaskName,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBTaskRepository({ db: userDb })
	}
}

export default handlers
