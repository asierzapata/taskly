export type Id = string
export type FirstName = string
export type LastName = string
export type Picture = string
export type Email = string

export type User = {
	_id: Id
	firstName: FirstName
	lastName: LastName
	picture: Picture
	email?: Email
}
