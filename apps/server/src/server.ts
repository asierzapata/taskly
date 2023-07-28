import express, {
	type ErrorRequestHandler,
	type NextFunction,
	type Request,
	type Response
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
import { Nuts } from 'nuts-serve'

import { type AuthenticationService } from './services/authentication'

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
import { type ModulesFactory } from './modules'
import { MongoDB } from './services/database/mongodb'
import { ApplicationError } from './utils/application_error'
import { type GoogleAuthenticationService } from './services/google_auth'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

class Server {
	app
	server
	mongoDbData
	mongoDbUser

	constructor() {
		this.app = express()
		this.server = new HTTPServer({ app: this.app, port: env.PORT })
		const dbLogger = new Logger({
			name: LOGGER_SOURCES.MONGO_DB,
			enabled: env.logging.enabled,
			level: env.logging.level,
			prettyPrint: true
		})
		this.mongoDbData = new MongoDB({
			url: env.mongoDb.uri,
			name: env.mongoDb.dataDbName,
			logger: dbLogger
		})
		this.mongoDbUser = new MongoDB({
			url: env.mongoDb.uri,
			name: env.mongoDb.userDbName,
			logger: dbLogger
		})
	}

	async start({
		authenticationService,
		googleAuthenticationService,
		modules
	}: {
		authenticationService: AuthenticationService
		googleAuthenticationService: GoogleAuthenticationService
		modules: ModulesFactory
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

		// Database
		// --------

		await this.mongoDbData.connect()
		await this.mongoDbUser.connect()

		// Dependency Injection
		// --------------------

		router.use((req: Request, res: Response, next: NextFunction) => {
			if (!this.mongoDbData.db || !this.mongoDbUser.db) {
				throw ApplicationError.Programmer({
					errorName: 'MongoDBNotConnected',
					message: 'MongoDB is not connected',
					code: 'mongo-db-not-connected'
				})
			}

			req.authenticationService = authenticationService

			req.googleAuthenticationService = googleAuthenticationService

			req.modules = modules({
				dataDb: this.mongoDbData.db,
				userDb: this.mongoDbUser.db
			})

			return next()
		})
		router.use((req, res, next) => {
			void authenticate(req, res, next)
		})

		// API
		// ---

		router.use('/health', health)
		router.use(api.route, api.router)

		// Desktop App Updater
		// -------------------

		const nuts = Nuts({
			// GitHub configuration
			repository: 'asierzapata/taskly',
			token: env.nuts.githubApiKey,
			refreshSecret: env.nuts.refreshSecret
		})

		router.use('/desktop', nuts.router)

		nuts.before('download', function (download, next) {
			console.log(
				'User is downloading',
				download.platform.filename,
				'for version',
				download.version.tag,
				'on channel',
				download.version.channel,
				'for',
				download.platform.type
			)

			next()
		})

		nuts.after('download', function (download, next) {
			console.log(
				'User downloaded',
				download.platform.filename,
				'for version',
				download.version.tag,
				'on channel',
				download.version.channel,
				'for',
				download.platform.type
			)

			next()
		})

		// Error Handling
		// --------------

		const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
			if (err instanceof Error) {
				errorMiddleware(err, req, res, next, expressApplicationLogger)
			} else {
				errorMiddleware(
					ApplicationError.Programmer({
						errorName: 'Error in error middleware',
						message: 'Unknown error',
						code: 'error-in-error-middleware'
					}),
					req,
					res,
					next,
					expressApplicationLogger
				)
			}
		}

		// TODO: Improve error handling
		router.use(errorRequestHandler)

		this.app.use(router)

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
