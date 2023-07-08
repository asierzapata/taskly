import { UserSchema } from '@renderer/api/parsers/user'
import { api } from '@renderer/api/api'
import _ from 'lodash'

type SignInWithGoogleParameters = {
	code: string
}

const signInWithGoogle = async ({ code }: SignInWithGoogleParameters) => {
	const response = await api.post('/authentication/google', {
		code
	})
	const { data } = response.data
	return UserSchema.parse(data.user)
}

const getAuthenticatedUser = async () => {
	const response = await api.get('/authentication/me')
	const { data } = response.data

	if (_.isEmpty(data.user)) return

	return UserSchema.parse(data.user)
}

export const Api = {
	signInWithGoogle,
	getAuthenticatedUser
}
