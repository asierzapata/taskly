import { type UserRepository } from '.'
import { type User } from '../../domain/user'

import { type Collection, type Db, ObjectId } from 'mongodb'

type DBUser = Omit<User, '_id'> & {
	_id: ObjectId
}

class MongoDBUserRepository implements UserRepository {
	collection: Collection<DBUser>

	constructor({ db }: { db: Db }) {
		this.collection = db.collection('users')
		this.ensureIndex()
	}

	async getUserById(id: string) {
		const response = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		return this.parseUser(response)
	}

	async saveUser(user: User) {
		await this.collection.insertOne({
			_id: new ObjectId(user._id),
			firstName: user.firstName,
			lastName: user.lastName,
			picture: user.picture,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		})
	}

	generateId() {
		return new ObjectId().toHexString()
	}

	parseUser(user: DBUser | null): User | null {
		if (!user) {
			return null
		}

		return {
			...user,
			_id: user._id.toHexString()
		}
	}

	ensureIndex() {
		// TO ADD
	}
}

export { MongoDBUserRepository }
