import { z } from 'zod'
import { LOGGER_LEVELS } from '../services/logger/logger'

export const schema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']),
	PORT: z.coerce.number(),
	LOGGING_ENABLED: z.coerce.boolean(),
	LOGGING_LEVEL: z.enum(LOGGER_LEVELS),
	JWT_SECRET: z.string(),
	JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']),
	JWT_EXPIRATION: z.string(),
	JWT_COOKIE_NAME: z.string(),
	MONGODB_URI: z.string(),
	MONGODB_NAME: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_REDIRECT_URL: z.string()
})

export const env = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	LOGGING_ENABLED: process.env.LOGGING_ENABLED,
	LOGGING_LEVEL: process.env.LOGGING_LEVEL,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_ALGORITHM: process.env.JWT_ALGORITHM,
	JWT_EXPIRATION: process.env.JWT_EXPIRATION,
	JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME,
	MONGODB_URI: process.env.MONGODB_URI,
	MONGODB_NAME: process.env.MONGODB_NAME,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL
}
