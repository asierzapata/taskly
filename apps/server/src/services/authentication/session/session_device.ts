import _ from 'lodash'
import Chance from 'chance'
const chance = new Chance()

import { detect } from 'detect-browser'

/* ====================================================== */
/*                       Exceptions                       */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const DEFAULT_RANDOM_USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'

const platforms = {
	BROWSER: 'browser',
	UNKNOWN: 'unknown'
}

const browsers = [
	'aol',
	'edge',
	'edge-ios',
	'yandexbrowser',
	'vivaldi',
	'kakaotalk',
	'samsung',
	'silk',
	'miui',
	'beaker',
	'edge-chromium',
	'chrome',
	'chromium-webview',
	'phantomjs',
	'crios',
	'firefox',
	'fxios',
	'opera-mini',
	'opera',
	'ie',
	'bb10',
	'android',
	'ios',
	'safari',
	'facebook',
	'instagram',
	'ios-webview',
	'searchbot'
]

const operatingSystems = [
	'iOS',
	'Android OS',
	'BlackBerry OS',
	'Windows Mobile',
	'Amazon OS',
	'Windows 3.11',
	'Windows 95',
	'Windows 98',
	'Windows 2000',
	'Windows XP',
	'Windows Server 2003',
	'Windows Vista',
	'Windows 7',
	'Windows 8',
	'Windows 8.1',
	'Windows 10',
	'Windows ME',
	'Open BSD',
	'Sun OS',
	'Linux',
	'Mac OS',
	'QNX',
	'BeOS',
	'OS/2',
	'Chrome OS'
]

export type SessionDeviceValue = {
	userAgent?: string
	platform?: string
	name?: string
	version?: string
	os?: string
	screenWidth?: number | null
	screenHeight?: number | null
}

class SessionDevice {
	_value: SessionDeviceValue

	constructor({
		userAgent = '',
		platform = '',
		name = '',
		version = '',
		os = '',
		screenWidth = null,
		screenHeight = null
	}: SessionDeviceValue = {}) {
		this._value = {
			userAgent,
			platform,
			name,
			version,
			os,
			screenWidth,
			screenHeight
		}
	}

	// Named constructors
	// ------------------

	static browserUserAgent({
		userAgent = '',
		screenWidth = null,
		screenHeight = null
	}: {
		userAgent?: string
		screenWidth?: string | null
		screenHeight?: string | null
	}) {
		if (!userAgent) {
			return new this({
				userAgent: '',
				platform: platforms.BROWSER,
				name: '',
				version: '',
				os: '',
				screenWidth: screenWidth ? parseInt(screenWidth, 10) : null,
				screenHeight: screenHeight ? parseInt(screenHeight, 10) : null
			})
		}
		const browser = detect(userAgent)
		if (!browser) {
			return new this({
				userAgent,
				platform: platforms.BROWSER,
				screenWidth: screenWidth ? parseInt(screenWidth, 10) : null,
				screenHeight: screenHeight ? parseInt(screenHeight, 10) : null
			})
		}
		return new this({
			userAgent,
			platform: platforms.BROWSER,
			name: browser.name,
			version: browser.version || '',
			os: browser.os || '',
			screenWidth: screenWidth ? parseInt(screenWidth, 10) : null,
			screenHeight: screenHeight ? parseInt(screenHeight, 10) : null
		})
	}

	static undetectable() {
		return new this({
			userAgent: '',
			platform: '',
			name: '',
			version: '',
			os: '',
			screenWidth: null,
			screenHeight: null
		})
	}

	static random({
		userAgent = DEFAULT_RANDOM_USER_AGENT,
		platform = chance.pickone(_.values(platforms)),
		name = chance.pickone(browsers),
		version = chance.hash({ length: 5 }),
		os = chance.pickone(operatingSystems),
		screenWidth = chance.integer({ min: 380, max: 1080 }),
		screenHeight = chance.integer({ min: 200, max: 780 })
	} = {}) {
		return new this({
			userAgent,
			platform,
			name,
			version,
			os,
			screenWidth,
			screenHeight
		})
	}

	// Methods
	// -------

	isDetected() {
		return !!this._value.platform
	}

	toValue() {
		return this._value
	}
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SessionDevice }
