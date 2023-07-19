import { type Area } from '../../domain/area'

export type GetAreasByUserIdParameters = {
	userId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	cursor: string
	limit: number
}

export interface AreaRepository {
	getAreaById(id: string): Promise<Area | undefined | null>
	getAreasByUserId(parameters: GetAreasByUserIdParameters): Promise<{
		areas: Area[]
		nextCursor: string | null
	}>
	saveArea(area: Area): Promise<void>
	changeAreaName(id: string, name: string): Promise<void>
	changeAreaDescription(id: string, description: string): Promise<void>
	generateId(): string
}
