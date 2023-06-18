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
import { NotesWebSocket } from './services/notes_web_socket'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

class Server {
	app
	server
	notesWebSocket

	constructor() {
		this.app = express()
		this.server = new HTTPServer({ app: this.app, port: env.PORT })
		this.notesWebSocket = new NotesWebSocket({
			route: '/notes',
			server: this.server,
			env
		})
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

		// In testing we don't actually need the http server
		// to start in order to test the app
		if (!env.isTesting) {
			this.notesWebSocket.start()
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
