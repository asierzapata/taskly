export type Task = {
	id: string
	title: string
	description: string
	createdAt: number
	updatedAt: number
	completedAt?: number
	deletedAt?: number
	areaId?: string
}

export type Area = {
	id: string
	name: string
	description: string
	numberOfTasks: number
	createdAt: number
	updatedAt: number
	deletedAt?: number
}

export type Tasks = Task[]
export type Areas = Area[]
