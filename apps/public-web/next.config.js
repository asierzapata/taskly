// @ts-check

import('./src/env/server.mjs')

module.exports = {
	reactStrictMode: false,
	swcMinify: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en'
	},
	transpilePackages: ['@taskly/web-ui']
}
