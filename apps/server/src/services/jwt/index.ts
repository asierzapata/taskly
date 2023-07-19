import assert from 'assert'
import jwt, { type Algorithm, JwtPayload, type Secret } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

class JWTService {
	_secret: Secret
	_algorithm: Algorithm
	_expiration: string | number

	constructor({
		secret,
		algorithm,
		expiration
	}: {
		secret: Secret
		algorithm: Algorithm
		expiration: string | number
	}) {
		assert(secret, 'JWT Service - Missing secret')
		assert(algorithm, 'JWT Service - Missing algorithm')
		assert(expiration, 'JWT Service - Missing expiration')
		this._secret = secret
		this._algorithm = algorithm
		this._expiration = expiration
	}

	generateToken(data: string | Buffer | object): Promise<string | undefined> {
		assert(data, 'JWT Service - Missing data')
		return new Promise((resolve, reject) => {
			jwt.sign(
				data,
				this._secret,
				{
					jwtid: uuidv4(),
					algorithm: this._algorithm,
					expiresIn: this._expiration
				},
				(err, token) => {
					if (err) return reject(err)
					return resolve(token)
				}
			)
		})
	}

	decodeToken<
		T extends { iat: number; exp: number; jti: string; [key: string]: any }
	>(token: string): Promise<T> {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				this._secret,
				{
					algorithms: [this._algorithm]
				},
				(err, data) => {
					if (err) return reject(err)

					if (!data) return reject(new Error('JWT Service - Invalid token'))

					if (typeof data !== 'object')
						return reject(new Error('JWT Service - Invalid token'))

					return resolve(data as T)
				}
			)
		})
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { JWTService }
