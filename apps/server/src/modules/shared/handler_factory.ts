import { Session } from '@server/services/authentication'

type HandlerAuthorization<P, D> = (
	parameters: P,
	dependencies: D,
	session: Session
) => Promise<void>

export const createHandler = <P, D, R>({
	authorize,
	handler,
	dependencies
}: {
	authorize: HandlerAuthorization<P, D>
	handler: (parameters: P, dependencies: D) => Promise<R>
	dependencies: D
}) => {
	return async (parameters: P, session: Session) => {
		if (!session.isAuthorized) {
			await authorize(parameters, dependencies, session)
		}
		return handler(parameters, dependencies)
	}
}
