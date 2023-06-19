import { AreaRepository, GetAreasByUserIdParameters } from '.'
import { Area } from '../../domain/area'

import { Collection, Db, ObjectId } from 'mongodb'

type DBArea = Omit<Area, '_id' | 'userId'> & {
	_id: ObjectId
	userId: ObjectId
}

class MongoDBAreaRepository implements AreaRepository {
	collection: Collection<DBArea>

	constructor({ db }: { db: Db }) {
		this.collection = db.collection('areas')
		this.ensureIndex()
	}

	// Reads

	async getAreaById(id: string) {
		const response = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		return this.parseArea(response)
	}

	async getAreasByUserId({
		userId,
		orderBy,
		order,
		cursor,
		limit
	}: GetAreasByUserIdParameters) {
		const response = await this.collection
			.find(
				{
					_id: {
						[order === 'asc' ? '$gt' : '$lt']: new ObjectId(cursor)
					},
					userId: new ObjectId(userId)
				},
				{
					sort: {
						[orderBy]: order === 'asc' ? 1 : -1
					},
					limit: limit + 1
				}
			)
			.toArray()

		return {
			areas: this.parseAreas(response.slice(0, limit)),
			nextCursor: response[limit]?._id.toHexString() || null
		}
	}

	// Writes

	async saveArea(area: Area) {
		this.collection.insertOne({
			_id: new ObjectId(area._id),
			userId: new ObjectId(area.userId),
			name: area.name,
			description: area.description,
			createdAt: area.createdAt,
			updatedAt: area.updatedAt
		})
	}

	async changeAreaName(id: string, name: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, updatedAt: new Date().getTime() } }
		)
	}

	async changeAreaDescription(id: string, description: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { description, updatedAt: new Date().getTime() } }
		)
	}

	// Helpers

	generateId() {
		return new ObjectId().toHexString()
	}

	parseAreas(areas: DBArea[]): Area[] {
		return areas.map(area => this.parseArea(area) as Area)
	}

	parseArea(area: DBArea | null): Area | null {
		if (!area) {
			return null
		}

		return {
			...area,
			_id: area._id.toHexString(),
			userId: area.userId.toHexString()
		}
	}

	ensureIndex() {}
}

export { MongoDBAreaRepository }
