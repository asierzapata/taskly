import { env } from './env'
import { Server } from './server'
import { AuthenticationService } from './services/authentication'
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
				})
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
