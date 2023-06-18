import express, {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response
} from 'express'
import expressPinoLogger from 'express-pino-logger'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import { Logger, LOGGER_SOURCES } from './services/logger/logger'
import { env } from './env'
import { HTTPServer } from './services/http_server/http_server'
import { uuid } from './services/uuid'

import { AuthenticationService } from './services/authentication'

import WebSocket from 'ws'
import * as Y from 'yjs'
import { MongodbPersistence } from 'y-mongodb-provider'
import yUtils from 'y-websocket/bin/utils'

/* ====================================================== */
/*                      Middleware                        */
/* ====================================================== */

import { errorMiddleware } from './middleware/error/error_middleware'
import { authenticate } from './middleware/authentication'

/* ====================================================== */
/*                        Routes                          */
/* ====================================================== */

import health from './health'
import * as api from './api'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

class Server {
	app
	server

	constructor() {
		this.app = express()
		this.server = new HTTPServer({ app: this.app, port: env.PORT })
	}

	async start({
		authenticationService
	}: {
		authenticationService: AuthenticationService
	}) {
		this.app.set('port', env.PORT)

		this.app.use(helmet())
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use(cookieParser())

		if (!env.isProduction) {
			// this.app.use(cors())
			this.app.use(
				cors({
					origin: [/http:\/\/localhost:\d+$/],
					allowedHeaders: ['Content-Type', 'Authorization'],
					credentials: true
				})
			)
		}

		const expressApplicationLogger = new Logger({
			name: LOGGER_SOURCES.WEB_BACKEND,
			enabled: env.logging.enabled,
			level: env.logging.level,
			prettyPrint: true
		})

		// Logging
		// -------

		const router = express.Router()

		router.use((req, res, next) => {
			req.id = uuid()
			return next()
		})

		if (!env.isTesting) {
			router.use(
				expressPinoLogger({
					logger: expressApplicationLogger.logger,
					genReqId: req => req.id
				})
			)
		}

		// Dependency Injection
		// --------------------

		router.use((req: Request, res: Response, next: NextFunction) => {
			req.authenticationService = authenticationService
			return next()
		})
		router.use(authenticate)

		// API
		// ---

		router.use('/health', health)
		router.use(api.route, api.router)

		// Error Handling
		// --------------

		const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
			errorMiddleware(err, req, res, next, expressApplicationLogger)
		}

		router.use(errorRequestHandler)

		this.app.use(router)

		// Websocket
		// ---------

		// y-websocket
		const wss = new WebSocket.Server({
			noServer: true
		})
		wss.on('connection', yUtils.setupWSConnection)
		this.server.on('upgrade', (request, socket, head) => {
			if (request.url.startsWith('/notes')) {
				wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
					// TODO: check authentication to see if user is allowed to access this document
					wss.emit('connection', ws, request)
				})
				return
			}

			socket.destroy()
		})

		const mdb = new MongodbPersistence(env.MONGODB_URI, {
			collectionName: 'notes',
			flushSize: 100
			// multipleCollections: true
		})

		yUtils.setPersistence({
			bindState: async (docName: string, ydoc: Y.Doc) => {
				// Here you listen to granular document updates and store them in the database
				// You don't have to do this, but it ensures that you don't lose content when the server crashes
				// See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
				// document updates

				// official default code from: https://github.com/yjs/y-websocket/blob/37887badc1f00326855a29fc6b9197745866c3aa/bin/utils.js#L36
				const persistedYdoc = await mdb.getYDoc(docName)
				const newUpdates = Y.encodeStateAsUpdate(ydoc)
				mdb.storeUpdate(docName, newUpdates)
				Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
				ydoc.on('update', async update => {
					mdb.storeUpdate(docName, update)
				})
			},
			writeState: async (docName: string, ydoc: Y.Doc) => {
				// This is called when all connections to the document are closed.
				const persistedYdoc = await mdb.getYDoc(docName)
				const newUpdates = Y.encodeStateAsUpdate(ydoc)
				mdb.storeUpdate(docName, newUpdates)
				Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
			}
		})

		// In testing we don't actually need the http server
		// to start in order to test the app
		if (!env.isTesting) {
			await this.server.start({ logger: expressApplicationLogger })
		}

		return { app: this.app, serverLogger: expressApplicationLogger }
	}

	stop() {
		if (env.isTesting) return
		if (this.server) return this.server.stop()
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Server }
