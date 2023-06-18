import { env } from './env'
import modules from './modules'
import { Server } from './server'
import { AuthenticationService } from './services/authentication'
import { GoogleAuthenticationService } from './services/google_auth'
import { Logger } from './services/logger/logger'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

class Application {
	server: Server
	logger

	constructor() {
		this.server = new Server()
		this.logger = new Logger({
			name: 'application',
			enabled: env.logging.enabled,
			level: env.logging.level,
			prettyPrint: true
		})
	}

	async start() {
		try {
			const { app } = await this.server.start({
				authenticationService: new AuthenticationService({
					secret: env.authentication.secret,
					algorithm: env.authentication.algorithm,
					expiration: env.authentication.expiration,
					cookieName: env.authentication.cookieName
				}),
				googleAuthenticationService: new GoogleAuthenticationService({
					webClient: {
						clientId: env.google.clientId,
						clientSecret: env.google.clientSecret,
						redirectUrl: env.google.redirectUrl
					}
				}),
				modules
			})
			this.logger.info('Application Started!')
			return { app, logger: this.logger }
		} catch (err) {
			console.error('Application Failed to start!', err)
			throw err
		}
	}

	async stop() {
		this.server.stop()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Application }
