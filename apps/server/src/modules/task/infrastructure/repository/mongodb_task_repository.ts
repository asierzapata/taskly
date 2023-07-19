import {
	type TaskRepository,
	type GetTasksByUserIdParameters,
	type GetTasksByProjectIdParameters
} from '.'
import { type Task } from '../../domain/task'

import { type Collection, type Db, ObjectId } from 'mongodb'

type DBTask = Omit<Task, '_id' | 'userId' | 'projectId' | 'noteId'> & {
	_id: ObjectId
	userId: ObjectId
	projectId: ObjectId
	noteId: ObjectId
}

class MongoDBTaskRepository implements TaskRepository {
	collection: Collection<DBTask>

	constructor({ db }: { db: Db }) {
		this.collection = db.collection('tasks')
		this.ensureIndex()
	}

	// Reads

	async getTaskById(id: string) {
		const response = await this.collection.findOne({
			_id: new ObjectId(id)
		})

		return this.parseTask(response)
	}

	async getTasksByUserId({
		userId,
		orderBy,
		order,
		cursor,
		limit
	}: GetTasksByUserIdParameters) {
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
			tasks: this.parseTasks(response.slice(0, limit)),
			nextCursor: response[limit]?._id.toHexString() || null
		}
	}

	async getTasksByProjectId({
		projectId,
		orderBy,
		order,
		cursor,
		limit
	}: GetTasksByProjectIdParameters) {
		const response = await this.collection
			.find(
				{
					_id: {
						[order === 'asc' ? '$gt' : '$lt']: new ObjectId(cursor)
					},
					projectId: new ObjectId(projectId)
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
			tasks: this.parseTasks(response.slice(0, limit)),
			nextCursor: response[limit]?._id.toHexString() || null
		}
	}

	// Writes

	async saveTask(task: Task) {
		this.collection.insertOne({
			_id: new ObjectId(task._id),
			userId: new ObjectId(task.userId),
			projectId: new ObjectId(task.projectId),
			noteId: new ObjectId(task.noteId),
			name: task.name,
			createdAt: task.createdAt,
			updatedAt: task.updatedAt
		})
	}

	async changeTaskName(id: string, name: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, updatedAt: new Date().getTime() } }
		)
	}

	async changeTaskDescription(id: string, description: string) {
		this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { description, updatedAt: new Date().getTime() } }
		)
	}

	// Helpers

	generateId() {
		return new ObjectId().toHexString()
	}

	parseTasks(tasks: DBTask[]): Task[] {
		return tasks.map(task => this.parseTask(task) as Task)
	}

	parseTask(task: DBTask | null): Task | null {
		if (!task) {
			return null
		}

		return {
			...task,
			_id: task._id.toHexString(),
			userId: task.userId.toHexString(),
			projectId: task.projectId.toHexString(),
			noteId: task.noteId.toHexString()
		}
	}

	ensureIndex() {
		this.collection.createIndex({ userId: 1 })
		this.collection.createIndex({ projectId: 1 })
	}
}

export { MongoDBTaskRepository }
