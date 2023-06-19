export type Id = string
export type UserId = Id
export type AreaId = Id
export type NoteId = Id
export type Name = string
export type CreatedAt = number
export type UpdatedAt = number

export type Task = {
	_id: Id
	userId: UserId
	projectId: AreaId
	noteId: NoteId
	name: Name
	createdAt: CreatedAt
	updatedAt: UpdatedAt
}
