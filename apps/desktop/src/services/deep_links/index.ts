import { MainApi } from '@modules/main_api'
import _ from 'lodash'

export const protocol = 'taskly' as const
export const deepLinks = {
	magicLinkCallback: {
		url: `${protocol}://magiclink`,
		handler: magicLinkCallbackHandler
	}
} as const

export const handleDeepLink = (url: string, mainApi: MainApi) => {
	const urlObject = new URL(url)
	const isTasklyProtocol = urlObject.protocol === `${protocol}:`
	if (!isTasklyProtocol) return

	_.forEach(deepLinks, deepLink => {
		const matchesDeepLink = url.includes(deepLink.url)
		console.log('>>>>>>', matchesDeepLink, deepLink.url)
		if (matchesDeepLink) return deepLink.handler(url, mainApi)
	})
}

// The url hash will contain the following:
// {
//   'access_token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjg2NTEwNTU5LCJzdWIiOiI3YmNhZTJjMS05NjNlLTQzYjMtODI2MC1iM2JjOWM0YmFkZGUiLCJlbWFpbCI6ImFzaWVyLnphcGF0YUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE2ODY1MDY5NTl9XSwic2Vzc2lvbl9pZCI6IjYwMjdmMjQzLWY4OGMtNDljNi04NjQ2LTRmNzhlNmQwZGY0YiJ9.eFa33HB6cLG4PXY_DoDP5KOXMUjooboomXxEftKDX40',
//   'expires_in' => '3600',
//   'refresh_token' => 'X50QOkqjM6IYFqAvv0Gg6w',
//   'token_type' => 'bearer',
//   'type' => 'magiclink'
// }
function magicLinkCallbackHandler(url: string, mainApi: MainApi) {
	const urlObject = new URL(url)
	const hash = urlObject.hash

	const hashParams = new URLSearchParams(hash.split('#')[1])

	console.log(
		'>>>>>>',
		hashParams.get('access_token'),
		hashParams.get('refresh_token')
	)

	mainApi.authentication.AuthenticateMagicLink({
		accessToken: hashParams.get('access_token'),
		refreshToken: hashParams.get('refresh_token')
	})
}
