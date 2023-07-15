import { MainApi } from '@modules/main_api'
import _ from 'lodash'

export const protocol = 'taskly' as const
export const deepLinks = {
	magicLinkCallback: {
		url: `${protocol}://auth/google_callback`,
		handler: googleAuthenticationCallback
	}
} as const

export const handleDeepLink = (url: string, mainApi: MainApi) => {
	console.log('>>>>>> depliink initial', url)
	const urlObject = new URL(url)
	const isTasklyProtocol = urlObject.protocol === `${protocol}:`
	if (!isTasklyProtocol) return

	console.log('>>>>>> deep link', url)

	_.forEach(deepLinks, deepLink => {
		const matchesDeepLink = url.includes(deepLink.url)
		if (matchesDeepLink) return deepLink.handler(url, mainApi)
	})
}

function googleAuthenticationCallback(url: string, mainApi: MainApi) {
	const urlObject = new URL(url)
	const code = urlObject.searchParams.get('code')

	if (!code) return

	mainApi.authentication.SignInWithGoogleCallback({
		code
	})
}
