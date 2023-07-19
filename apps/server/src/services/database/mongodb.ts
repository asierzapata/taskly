import { type Logger } from '../logger/logger'

import assert from 'assert'
import { MongoClient, type Db } from 'mongodb'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

class MongoDB {
	url: string
	name: string
	logger: Logger
	client?: MongoClient
	db?: Db

	constructor({
		url,
		name,
		logger
	}: {
		url: string
		name: string
		logger: Logger
	}) {
		assert(url, 'MongoDB - Missing url field')
		assert(name, 'MongoDB - Missing name field')
		this.url = url
		this.name = name
		this.logger = logger
	}

	async connect() {
		const client = await MongoClient.connect(this.url)

		this.client = client
		this.db = client.db(this.name)

		return {
			db: this.db,
			startTransaction() {
				// const session = client.startSession()
				// session.startTransaction()
				return {
					async commitTransaction() {
						// await session.commitTransaction()
						// session.endSession()
					},
					async abortTransaction() {
						// await session.abortTransaction()
						// session.endSession()
					}
				}
			}
		}
	}

	async disconnect() {
		if (this.client) await this.client.close()
		this.client = undefined
		this.db = undefined
	}

	async drop() {
		await this.db?.dropDatabase()
		await this.disconnect()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { MongoDB }
