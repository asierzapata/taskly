import { type User } from '@server/modules/user/domain/user'
import { Session } from '@server/services/authentication'
import { generateDBId } from '@server/utils/id'
import { checkString } from '@server/utils/input_validators'
import {
	type SuccessResponse,
	successReponse
} from '@server/utils/response_factory'
import { type NextFunction, type Request, type Response } from 'express'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type SignInWithGoogleControllerParameters = void
type SignInWithGoogleControllerQuery = void
type SignInWithGoogleControllerBody = { code: string }
type SignInWithGoogleControllerResponse = SuccessResponse<
	{
		user: User | null | undefined
	},
	{
		token: string | undefined
	}
>

async function signInWithGoogleController(
	req: Request<
		SignInWithGoogleControllerParameters,
		SignInWithGoogleControllerResponse,
		SignInWithGoogleControllerBody,
		SignInWithGoogleControllerQuery
	>,
	res: Response<SignInWithGoogleControllerResponse>,
	next: NextFunction
) {
	try {
		if (!req.session) {
			throw new Error('Session is not defined')
		}

		// We set the session as authorized because we are going to sign in into an account or create one
		req.session.setAsAuthorized()

		const code = checkString(req.body.code)

		const googleUser =
			await req.googleAuthenticationService.getGoogleUserFromCode({
				code
			})

		const account =
			await req.modules.account.getAccountByProviderAndProviderAccountId(
				{
					provider: 'google',
					providerAccountId: googleUser.id
				},
				req.session
			)

		let userId = account?.userId

		if (!userId) {
			userId = generateDBId()

			await req.modules.account.createAccount(
				{
					userId,
					provider: 'google',
					providerAccountId: googleUser.id
				},
				req.session
			)

			await req.modules.user.createUser(
				{
					userId,
					email: googleUser.email,
					firstName: googleUser.firstName,
					lastName: googleUser.lastName,
					picture: googleUser.picture
				},
				req.session
			)
		}

		const user = await req.modules.user.getUserById({ userId }, req.session)

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
			data: {
				user
			},
			meta: {
				token: jwtToken
			}
		})
	} catch (error) {
		return next(error)
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { signInWithGoogleController }
