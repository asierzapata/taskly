import { createMethodCalledFromMain } from '@modules/factory'
import _ from 'lodash'

type AuthenticationSuccessParameters = { token: string }
type AuthenticationSuccessResponse = { sessionToken: string }

const AuthenticationSuccess = async (
	payload: AuthenticationSuccessParameters
): Promise<AuthenticationSuccessResponse> => {
	return new Promise(resolve => {
		return resolve({ sessionToken: payload.token })
	})
}

export const AuthenticationSuccessGenerator = createMethodCalledFromMain<
	'AuthenticationSuccess',
	AuthenticationSuccessParameters,
	AuthenticationSuccessResponse
>('AuthenticationSuccess', AuthenticationSuccess)
