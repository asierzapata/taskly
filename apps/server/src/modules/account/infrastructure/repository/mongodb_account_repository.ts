import {
	AccountRepository,
	GetAccountByProviderAndProviderAccountIdParameters
} from '.'
import { Account } from '../../domain/account'

import { Collection, Db, ObjectId } from 'mongodb'

type DBAccount = Omit<Account, '_id' | 'userId'> & {
	_id: ObjectId
	userId: ObjectId
}

class MongoDBAccountRepository implements AccountRepository {
	collection: Collection<DBAccount>

	constructor({ db }: { db: Db }) {
		this.collection = db.collection('accounts')
		this.ensureIndex()
	}

	async getAccountByProviderAndProviderAccountId({
		provider,
		providerAccountId
	}: GetAccountByProviderAndProviderAccountIdParameters) {
		const response = await this.collection.findOne({
			provider,
			providerAccountId
		})

		return this.parseAccount(response)
	}

	async saveAccount(account: Account) {
		this.collection.insertOne({
			_id: new ObjectId(account._id),
			userId: new ObjectId(account.userId),
			provider: account.provider,
			providerAccountId: account.providerAccountId,
			refreshToken: account.refreshToken,
			accessToken: account.accessToken,
			expiresAt: account.expiresAt,
			tokenType: account.tokenType
		})
	}

	generateId() {
		return new ObjectId().toHexString()
	}

	parseAccount(account: DBAccount | null): Account | null {
		if (!account) {
			return null
		}

		return {
			...account,
			_id: account._id.toHexString(),
			userId: account.userId.toHexString()
		}
	}

	ensureIndex() {
		this.collection.createIndex(
			{ provider: 1, providerAccountId: 1 },
			{ unique: true, background: true }
		)
	}
}

export { MongoDBAccountRepository }
