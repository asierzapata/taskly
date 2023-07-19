import ms from 'ms'
import { JWTService } from '@server/services/jwt'
import { type Algorithm, JwtPayload, type Secret } from 'jsonwebtoken'
import { Session } from './session/session'
import { type SessionTypeValue } from './session/session_type'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

class AuthenticationService {
	jwtService: JWTService
	cookieName: string
	cookieConfig: {
		secure: boolean
		httpOnly: boolean
		maxAge: number
	}

	constructor({
		secret,
		algorithm,
		expiration,
		cookieName
	}: {
		secret: Secret
		algorithm: Algorithm
		expiration: string
		cookieName: string
	}) {
		this.jwtService = new JWTService({
			secret,
			algorithm,
			expiration: ms(expiration)
		})
		this.cookieName = cookieName
		this.cookieConfig = {
			secure: true,
			httpOnly: true,
			maxAge: ms(expiration)
		}
	}

	async authenticate(session: Session) {
		if (!session) throw new Error('AuthenticationService.authenticate')
		const token = await this.jwtService.generateToken({
			type: session.getType().toValue(),
			distinctId: session.getDistinctId()
		})
		return {
			jwtToken: token,
			authorizationHeader: {
				data: `Bearer ${token}`
			},
			cookie: {
				cookieName: this.cookieName,
				data: token,
				config: this.cookieConfig
			}
		}
	}

	async verify(token: string) {
		if (!token) return
		const tokenData = await this.jwtService.decodeToken<{
			type: SessionTypeValue
			distinctId: string
			iat: number
			exp: number
			jti: string
		}>(token)
		return {
			iat: tokenData.iat,
			exp: tokenData.exp,
			jti: tokenData.jti,
			// Data
			type: tokenData.type,
			distinctId: tokenData.distinctId
		}
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AuthenticationService, Session }
