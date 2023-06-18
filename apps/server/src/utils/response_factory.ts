import { Response } from 'express'

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { successReponse }

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

function successReponse({
	res,
	statusCode,
	data = {},
	meta = {}
}: {
	res: Response
	statusCode: number
	data?: any
	meta?: any
}) {
	return res.status(statusCode).json({
		data,
		meta
	})
}
