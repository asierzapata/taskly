import { Db } from 'mongodb'

import { UserRepository } from './infrastructure/repository'
import { MongoDBUserRepository } from './infrastructure/repository/mongodb_user_repository'
import { GlobalDependencies } from '@server/types/shared'
import { CreateUserParameters, createUser } from './application/create_user'
import {
	GetUserByIdParameters,
	getUserById
} from './application/get_user_by_id'

export type ModuleDependencies = {
	repository: UserRepository
}

const handlers = (globalDependencies: GlobalDependencies) => ({
	createUser: (parameters: CreateUserParameters) =>
		createUser(parameters, {
			...globalDependencies,
			...dependencies(globalDependencies)
		}),
	getUserById: (parameters: GetUserByIdParameters) =>
		getUserById(parameters, {
			...globalDependencies,
			...dependencies(globalDependencies)
		})
})

const dependencies = ({ userDb }: GlobalDependencies): ModuleDependencies => {
	return {
		repository: new MongoDBUserRepository({ db: userDb })
	}
}

export default handlers
