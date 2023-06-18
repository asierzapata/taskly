import { ApplicationError } from '@server/utils/application_error'
import { OAuth2Client } from 'google-auth-library'

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

class GoogleAuthenticationService {
	private readonly webClient: {
		clientId: string
		clientSecret: string
		redirectUrl: string
	}
	private readonly client: OAuth2Client

	constructor({
		webClient
	}: {
		webClient: {
			clientId: string
			clientSecret: string
			redirectUrl: string
		}
	}) {
		this.webClient = webClient
		this.client = new OAuth2Client(
			webClient.clientId,
			webClient.clientSecret,
			webClient.redirectUrl
		)
	}

	async getGoogleUserFromCode({ code }: { code: string }) {
		const { tokens } = await this.client.getToken(code)
		this.client.setCredentials(tokens)
		const userProfile = await this.client.verifyIdToken({
			idToken: tokens.id_token || '',
			audience: [this.webClient.clientId]
		})
		const googleUser = {
			id: userProfile.getUserId() || '',
			email: userProfile.getPayload()?.email
				? userProfile.getPayload()?.email?.toLowerCase().trim()
				: '',
			picture: userProfile.getPayload()?.picture || '',
			firstName: userProfile.getPayload()?.given_name || '',
			lastName: userProfile.getPayload()?.family_name || '',
			locale: userProfile.getPayload()?.locale || 'en'
		}

		return googleUser
	}

	async getGoogleUserFromIdToken({ idToken }: { idToken: string }) {
		const ticket = await this.client.verifyIdToken({
			idToken,
			audience: [this.webClient.clientId]
		})
		const userProfile = ticket.getPayload()

		if (!userProfile) {
			throw ApplicationError.Operational({
				errorName: 'api.1.error.google_auth_service.invalid_id_token',
				message: 'Invalid ID Token',
				code: 'invalid-id-token'
			})
		}

		const googleUser = {
			id: ticket.getUserId() || '',
			email: userProfile.email ? userProfile.email.toLowerCase().trim() : '',
			picture: userProfile.picture || '',
			firstName: userProfile.given_name || '',
			lastName: userProfile.family_name || '',
			locale: userProfile.locale || 'en'
		}

		return googleUser
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { GoogleAuthenticationService }
