import { Session } from '@server/services/authentication'
import { generateDBId } from '@server/utils/id'
import { checkString } from '@server/utils/input_validators'
import { successReponse } from '@server/utils/response_factory'
import { type NextFunction, type Request, type Response } from 'express'
import _ from 'lodash'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function getAuthenticatedUserController(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (!req.session) {
			throw new Error('Session is not defined')
		}

		if (_.isEmpty(req.session.getDistinctId())) {
			return successReponse({
				res,
				statusCode: 200,
				data: {
					user: {}
				},
				meta: {}
			})
		}

		const user = await req.modules.user.getUserById(
			{ userId: req.session.getDistinctId() },
			req.session
		)

		return successReponse({
			res,
			statusCode: 200,
			data: {
				user
			},
			meta: {}
		})
	} catch (error) {
		return next(error)
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { getAuthenticatedUserController }
