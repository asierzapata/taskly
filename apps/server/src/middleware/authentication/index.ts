import _ from 'lodash'
import { env } from '@server/env'

import { AuthenticationService, Session } from '@server/services/authentication'
import { SessionDevice } from '@server/services/authentication/session/session_device'

import { ApplicationError } from '@server/utils/application_error'

import { fromUnixTime, isAfter, sub } from 'date-fns'

import type { NextFunction, Request, Response } from 'express'
import { SessionSource } from '@server/services/authentication/session/session_source'

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

async function authenticate(req: Request, res: Response, next: NextFunction) {
	const userAgent = req.get('User-Agent')
	const clientSessionId = req.get('Client-Session-Id')
	// const clientVersion = req.get('Client-Version')
	const clientWindowWidth = req.get('Client-Window-Width')
	const clientWindowHeight = req.get('Client-Window-Height')

	const sessionToken = getTokenFromRequest(req)

	if (!req.authenticationService) {
		throw ApplicationError.Programmer({
			errorName: 'authentication-service-not-set-on-request',
			message: 'Something went really wrong.',
			code: 'authentication-service-not-set-on-request'
		})
	}
	try {
		const sessionData = await req.authenticationService.verify(sessionToken)
		const device = SessionDevice.browserUserAgent({
			userAgent,
			screenWidth: clientWindowWidth,
			screenHeight: clientWindowHeight
		}).toValue()

		if (!sessionData) {
			console.log('>>>>>> unauthenticated session')
			req.session = Session.unauthenticated({
				id: clientSessionId,
				device,
				source: SessionSource.httpRequest().toValue()
			})
			return next()
		}

		const session = new Session({
			id: clientSessionId,
			type: sessionData.type,
			distinctId: sessionData.distinctId,
			device
		})

		const { refreshedCookie, refreshedAutorizationHeader } = await refreshToken(
			{
				session,
				currentToken: {
					iat: sessionData.iat,
					exp: sessionData.exp,
					jti: sessionData.jti
				},
				authenticationService: req.authenticationService
			}
		)
		if (refreshedAutorizationHeader) {
			res.append('Authorization', refreshedAutorizationHeader.data)
		}
		if (refreshedCookie) {
			res.cookie(
				refreshedCookie.cookieName,
				refreshedCookie.data,
				refreshedCookie.config
			)
		}

		// TODO: respond with in meta too

		req.session = session

		return next()
	} catch (err) {
		next(err)
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { authenticate }

/* ====================================================== */
/*                        Helpers                         */
/* ====================================================== */

async function refreshToken({
	session,
	currentToken,
	authenticationService
}: {
	session: Session
	currentToken: { iat: number; exp: number; jti: string }
	authenticationService: AuthenticationService
}) {
	const mIssuedAt = fromUnixTime(currentToken.iat)
	const mHoursAgo = sub(new Date(), { hours: 1 })

	// Do not refresh if token was issued less than 1 hour ago
	if (isAfter(mIssuedAt, mHoursAgo)) return {}

	// TODO: Blacklist the tokenId (currentToken.jti)

	const { jwtToken, cookie, authorizationHeader } =
		await authenticationService.authenticate(session)

	return {
		refreshedJwtToken: jwtToken,
		refreshedCookie: cookie,
		refreshedAutorizationHeader: authorizationHeader
	}
}

function getTokenFromRequest(req: Request) {
	let token = ''

	// Get token from cookie
	if (!_.isEmpty(req.cookies[env.authentication.cookieName]))
		token = req.cookies[env.authentication.cookieName]

	// Get token from Header "Authorization: 'Bearer abc.123.xyz'"
	if (!_.isEmpty(req.headers.authorization))
		token = _.replace(req.headers.authorization || '', 'Bearer ', '')

	return token
}
