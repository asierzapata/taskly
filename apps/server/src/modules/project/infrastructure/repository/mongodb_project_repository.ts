import {
	ProjectRepository,
	GetProjectsByUserIdParameters,
	GetProjectsByAreaIdParameters
} from '.'
import { Project } from '../../domain/project'

import { Collection, Db, ObjectId } from 'mongodb'

type DBProject = Omit<Project, '_id' | 'userId' | 'areaId'> & {
	_id: ObjectId
	userId: ObjectId
	areaId: ObjectId
}

class MongoDBProjectRepository implements ProjectRepository {
	collection: Collection<DBProject>

	constructor({ db }: { db: Db }) {
		this.collection = db.collection('projects')
		this.ensureIndex()
	}

	// Reads

	async getProjectById(id: string) {
		const response = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		return this.parseProject(response)
	}

	async getProjectsByUserId({
		userId,
		orderBy,
		order,
		cursor,
		limit
	}: GetProjectsByUserIdParameters) {
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
			projects: this.parseProjects(response.slice(0, limit)),
			nextCursor: response[limit]?._id.toHexString() || null
		}
	}

	async getProjectsByAreaId({
		areaId,
		orderBy,
		order,
		cursor,
		limit
	}: GetProjectsByAreaIdParameters) {
		const response = await this.collection
			.find(
				{
					_id: {
						[order === 'asc' ? '$gt' : '$lt']: new ObjectId(cursor)
					},
					areaId: new ObjectId(areaId)
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
			projects: this.parseProjects(response.slice(0, limit)),
			nextCursor: response[limit]?._id.toHexString() || null
		}
	}

	// Writes

	async saveProject(project: Project) {
		this.collection.insertOne({
			_id: new ObjectId(project._id),
			userId: new ObjectId(project.userId),
			areaId: new ObjectId(project.areaId),
			name: project.name,
			description: project.description,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt
		})
	}

	async changeProjectName(id: string, name: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, updatedAt: new Date().getTime() } }
		)
	}

	async changeProjectDescription(id: string, description: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { description, updatedAt: new Date().getTime() } }
		)
	}

	// Helpers

	generateId() {
		return new ObjectId().toHexString()
	}

	parseProjects(projects: DBProject[]): Project[] {
		return projects.map(project => this.parseProject(project) as Project)
	}

	parseProject(project: DBProject | null): Project | null {
		if (!project) {
			return null
		}

		return {
			...project,
			_id: project._id.toHexString(),
			userId: project.userId.toHexString(),
			areaId: project.areaId.toHexString()
		}
	}

	ensureIndex() {}
}

export { MongoDBProjectRepository }
