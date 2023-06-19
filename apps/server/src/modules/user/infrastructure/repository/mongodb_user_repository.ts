import { UserRepository } from '.'
import { User } from '../../domain/user'

import { Collection, Db, ObjectId } from 'mongodb'

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
		this.collection.insertOne({
			_id: new ObjectId(user._id),
			firstName: user.firstName,
			lastName: user.lastName,
			picture: user.picture,
			email: user.email
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

	ensureIndex() {}
}

export { MongoDBUserRepository }
