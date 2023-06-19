import { Project } from '../../domain/project'

export type GetProjectsByUserIdParameters = {
	userId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	cursor: string
	limit: number
}

export type GetProjectsByAreaIdParameters = {
	areaId: string
	orderBy: 'name' | 'createdAt' | 'updatedAt'
	order: 'asc' | 'desc'
	cursor: string
	limit: number
}

export interface ProjectRepository {
	getProjectById(id: string): Promise<Project | undefined | null>
	getProjectsByUserId(parameters: GetProjectsByUserIdParameters): Promise<{
		projects: Project[]
		nextCursor: string | null
	}>
	getProjectsByAreaId(parameters: GetProjectsByAreaIdParameters): Promise<{
		projects: Project[]
		nextCursor: string | null
	}>
	saveProject(project: Project): Promise<void>
	changeProjectName(id: string, name: string): Promise<void>
	changeProjectDescription(id: string, description: string): Promise<void>
	generateId(): string
}
