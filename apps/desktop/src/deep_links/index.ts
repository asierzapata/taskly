import { MainApi } from '@modules/main_api'
import _ from 'lodash'

export const protocol = 'taskly' as const
export const deepLinks = {
	loginCallback: {
		url: `${protocol}://login-callback`,
		handler: loginCallbackHandler
	}
} as const

export const handleDeepLink = (url: string, mainApi: MainApi) => {
	const urlObject = new URL(url)
	const isTasklyProtocol = urlObject.protocol === `${protocol}:`
	if (!isTasklyProtocol) return

	_.forEach(deepLinks, deepLink => {
		const matchesDeepLink = url.includes(deepLink.url)
		if (!matchesDeepLink) return deepLink.handler(url, mainApi)
	})
}

function loginCallbackHandler(url: string, mainApi: MainApi) {
	const urlObject = new URL(url)
	const hash = urlObject.hash

	mainApi.authentication.AuthenticationSuccess({ token: hash })
}
