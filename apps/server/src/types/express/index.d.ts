import { type Modules } from '@server/modules'
import { type AuthenticationService, type Session } from '@server/services/authentication'
import { type GoogleAuthenticationService } from '@server/services/google_auth'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
	namespace Express {
		export interface Request {
			session?: Session
			authenticationService: AuthenticationService
			googleAuthenticationService: GoogleAuthenticationService
			modules: Modules
		}
	}
}
