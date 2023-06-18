declare module 'y-mongodb-provider' {
	export class MongodbPersistence {
		constructor(
			uri: string,
			options: { collectionName: string; flushSize: number }
		)
		getYDoc: (docName: string) => Promise<Y.Doc>
		storeUpdate: (docName: string, update: Uint8Array) => Promise<void>
	}
}
