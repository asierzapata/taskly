import type { Application } from 'express'

// import https from 'https'
import http, { Server } from 'http'
import { Logger } from '../logger/logger'
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
	}

	start({ logger }: { logger: Logger }) {
		return new Promise<Application>((resolve, reject) => {
			if (this.status === SERVER_STATUS.STARTED) return resolve(this.app)

			this.server = http.createServer(this.app)
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
}

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

export { HTTPServer }
