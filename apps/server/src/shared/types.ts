import { type Db } from 'mongodb'

export type GlobalDependencies = {
	dataDb: Db
	userDb: Db
}
