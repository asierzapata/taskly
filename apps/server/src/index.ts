import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({
	path: path.resolve(__dirname, `./env/${process.env.NODE_ENV}.env`)
})

import { Application } from './application'

const application = new Application()

application
	.start()
	.then(({ logger }) =>
		process.on('unhandledRejection', (err: Error) =>
			logger.fatal(err.toString())
		)
	)
	.catch(() => null)
