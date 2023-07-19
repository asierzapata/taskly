import { type Response } from 'express'

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { successReponse }

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

export type SuccessResponse<D, M> = {
	data: D
	meta: M
}

function successReponse<D, M>({
	res,
	statusCode,
	data,
	meta
}: {
	res: Response
	statusCode: number
	data?: D
	meta?: M
}) {
	return res.status(statusCode).json({
		data,
		meta
	})
}
