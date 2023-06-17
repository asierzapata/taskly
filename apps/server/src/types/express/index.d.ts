import { AuthenticationService, Session } from '@server/services/authentication'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
	namespace Express {
		export interface Request {
			session?: Session
			authenticationService?: AuthenticationService
		}
	}
}
