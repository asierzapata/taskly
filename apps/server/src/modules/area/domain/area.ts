export type Id = string
export type UserId = Id
export type Name = string
export type Description = string
export type CreatedAt = number
export type UpdatedAt = number

export type Area = {
	_id: Id
	userId: UserId
	name: Name
	description: Description
	createdAt: CreatedAt
	updatedAt: UpdatedAt
}
