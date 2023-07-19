import { type User } from '../../domain/user'

export interface UserRepository {
	getUserById(id: string): Promise<User | undefined | null>
	saveUser(user: Omit<User, 'id'>): Promise<void>
	generateId(): string
}
