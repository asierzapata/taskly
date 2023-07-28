import { type Modules } from '@server/modules'
import {
	type AuthenticationService,
	type Session
} from '@server/services/authentication'
import { type GoogleAuthenticationService } from '@server/services/google_auth'

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
