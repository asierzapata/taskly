import { z } from 'zod'

export const UserSchema = z.object({
	_id: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	picture: z.string()
})

export type User = z.infer<typeof UserSchema>
