/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

import { NextFunction, Request, Response } from 'express'
import { Logger } from '../../services/logger/logger'

type ErrorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
	logger: Logger
) => void

const errorMiddleware: ErrorMiddleware = (err, req, res, next, logger) => {
	logger.error(err.toString())

	if (res.headersSent) return

	res.status(500).json({
		error: err.toString(),
		data: {},
		meta: {}
	})
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { errorMiddleware }
