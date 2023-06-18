import { Session } from '@server/services/authentication'
import { generateDBId } from '@server/utils/id'
import { checkString } from '@server/utils/input_validators'
import { successReponse } from '@server/utils/response_factory'
import { NextFunction, Request, Response } from 'express'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

async function signInWithGoogleController(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const code = checkString(req.body.code)

		const googleUser =
			await req.googleAuthenticationService.getGoogleUserFromCode({
				code
			})

		const account =
			await req.modules.account.getAccountByProviderAndProviderAccountId({
				provider: 'google',
				providerAccountId: googleUser.id
			})

		let userId = account?.userId

		if (!userId) {
			userId = generateDBId()

			await req.modules.account.createAccount({
				userId,
				provider: 'google',
				providerAccountId: googleUser.id
			})
		}

		const session = Session.user({
			...req.session,
			distinctId: userId
		})

		const { jwtToken, cookie } = await req.authenticationService.authenticate(
			session
		)

		res.cookie(cookie.cookieName, cookie.data, cookie.config)

		return successReponse({
			res,
			statusCode: 200,
			data: {},
			meta: {
				token: jwtToken
			}
		})
	} catch (error) {
		console.log('>>>>>>', error)
		return next(error)
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { signInWithGoogleController }
