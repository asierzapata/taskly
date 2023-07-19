import { type UserRepository } from './infrastructure/repository'
import { MongoDBUserRepository } from './infrastructure/repository/mongodb_user_repository'
import { type GlobalDependencies } from '@server/shared/types'
import { authorizeCreateUser, createUser } from './application/create_user'
import { authorizeGetUserById, getUserById } from './application/get_user_by_id'
import { createHandler } from '../shared/handler_factory'

export type ModuleDependencies = {
	repository: UserRepository
}

const handlers = (globalDependencies: GlobalDependencies) => ({
	createUser: createHandler({
		authorize: authorizeCreateUser,
		handler: createUser,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	}),
	getUserById: createHandler({
		authorize: authorizeGetUserById,
		handler: getUserById,
		dependencies: {
			...globalDependencies,
			...dependencies(globalDependencies)
		}
	})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBUserRepository({ db: userDb })
	}
}

export default handlers
