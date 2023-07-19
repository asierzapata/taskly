import type { Application } from 'express'

// import https from 'https'
import http, { type Server } from 'http'
import { type Logger } from '../logger/logger'
import { ApplicationError } from '@server/utils/application_error'
// import fs from 'fs'
// import path from 'path'

const SERVER_STATUS = {
	UNSTARTED: 'unstarted',
	STARTED: 'started'
} as const

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

class HTTPServer {
	server?: Server
	status: (typeof SERVER_STATUS)[keyof typeof SERVER_STATUS]
	app
	port

	constructor({ app, port }: { app: Application; port: number }) {
		this.status = SERVER_STATUS.UNSTARTED
		this.app = app
		this.port = port
		this.server = http.createServer(this.app)
	}

	start({ logger }: { logger: Logger }) {
		return new Promise<Application>((resolve, reject) => {
			if (this.status === SERVER_STATUS.STARTED) return resolve(this.app)

			if (!this.server) {
				return reject(
					ApplicationError.Programmer({
						errorName: 'HTTPServerNotInitialized',
						message: 'HTTP server not initialized',
						code: 'http-server-not-initialized'
					})
				)
			}

			// this.server = https.createServer(
			// 	{
			// 		key: fs.readFileSync(path.join(__dirname, "./key.pem")),
			// 		cert: fs.readFileSync(path.join(__dirname, "./cert.pem"))
			// 	},
			// 	this.app
			// )
			this.server.on('error', (err: Error) => reject(err))
			this.server.on('close', () => {
				logger.info('HTTP server closed')
			})

			this.server.listen(this.port, () => {
				this.status = SERVER_STATUS.STARTED
				logger.info('HTTP server started!')
				logger.info(`HTTP server listening at ${this.port}`)
				return resolve(this.app)
			})
		})
	}

	stop() {
		return new Promise<void>((resolve, reject) => {
			if (this.status === SERVER_STATUS.UNSTARTED) return resolve()

			if (!this.server) return

			this.server.on('error', (err: Error) => reject(err))
			this.server.on('close', () => {
				this.status = SERVER_STATUS.UNSTARTED
				return resolve()
			})
			this.server.close()
			this.server = undefined
		})
	}

	on(event: string, callback: (...args: any[]) => void) {
		if (!this.server) return
		this.server.on(event, callback)
	}
}

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

export { HTTPServer }
