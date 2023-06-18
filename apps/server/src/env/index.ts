import { schema, env as currentEnv } from './schema'
import { ZodFormattedError } from 'zod'

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
	Object.entries(errors)
		.map(([name, value]) => {
			if (value && '_errors' in value)
				return `${name}: ${value._errors.join(', ')}\n`
		})
		.filter(Boolean)

const _env = schema.safeParse(currentEnv)

if (!_env.success) {
	console.error(
		'❌ Invalid environment variables:\n',
		...formatErrors(_env.error.format())
	)
	throw new Error('Invalid environment variables')
}

export const env = {
	..._env.data,
	isProduction: _env.data.NODE_ENV === 'production',
	isDevelopment: _env.data.NODE_ENV === 'development',
	isTesting: _env.data.NODE_ENV === 'test',
	logging: {
		enabled: _env.data.LOGGING_ENABLED,
		level: _env.data.LOGGING_LEVEL
	},
	authentication: {
		secret: _env.data.JWT_SECRET,
		algorithm: _env.data.JWT_ALGORITHM,
		expiration: _env.data.JWT_EXPIRATION,
		cookieName: _env.data.JWT_COOKIE_NAME
	},
	mongoDb: {
		uri: _env.data.MONGODB_URI,
		name: _env.data.MONGODB_NAME
	},
	google: {
		clientId: _env.data.GOOGLE_CLIENT_ID,
		clientSecret: _env.data.GOOGLE_CLIENT_SECRET,
		redirectUrl: _env.data.GOOGLE_REDIRECT_URL
	}
}

export type Env = typeof env
