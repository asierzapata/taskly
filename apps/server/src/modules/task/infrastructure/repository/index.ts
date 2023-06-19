import { Task } from '../../domain/task'

export type GetTasksByUserIdParameters = {
	userId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	cursor: string
	limit: number
}

export type GetTasksByProjectIdParameters = {
	projectId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	cursor: string
	limit: number
}

export interface TaskRepository {
	getTaskById(id: string): Promise<Task | undefined | null>
	getTasksByUserId(parameters: GetTasksByUserIdParameters): Promise<{
		tasks: Task[]
		nextCursor: string | null
	}>
	getTasksByProjectId(parameters: GetTasksByProjectIdParameters): Promise<{
		tasks: Task[]
		nextCursor: string | null
	}>
	saveTask(task: Task): Promise<void>
	changeTaskName(id: string, name: string): Promise<void>
	changeTaskDescription(id: string, description: string): Promise<void>
	generateId(): string
}
