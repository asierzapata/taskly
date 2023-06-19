import { Session } from '@server/services/authentication'
import { Area } from './area'

export const ensureUserCanAccessArea = (
	{ area }: { area: Area },
	{ session }: { session: Session }
): void => {
	if (area.userId !== session.getDistinctId()) {
		throw new Error('User cannot access area')
	}
}

export const ensureUserCanModifyArea = (
	{ area }: { area: Area },
	{ session }: { session: Session }
): void => {
	ensureUserCanAccessArea({ area }, { session })
}
