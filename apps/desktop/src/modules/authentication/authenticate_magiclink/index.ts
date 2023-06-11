import { createMethodCalledFromMain } from '@modules/factory'
import _ from 'lodash'
import { ModuleDependencies } from '../module'
import { Session } from '@supabase/supabase-js'

type AuthenticateMagicLinkParameters = {
	accessToken: string
	refreshToken: string
}
type AuthenticateMagicLinkResponse =
	| {
			error: string
			session: null
	  }
	| {
			session: Session
			error: null
	  }

const AuthenticateMagicLink = async ({
	parameters: { accessToken, refreshToken },
	dependencies: { supabase }
}: {
	parameters: AuthenticateMagicLinkParameters
	dependencies: ModuleDependencies
}): Promise<AuthenticateMagicLinkResponse> => {
	const { data, error } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	})

	if (error)
		return {
			error: error.message,
			session: null
		}

	return {
		session: data.session,
		error: null
	}
}

export const AuthenticateMagicLinkGenerator = createMethodCalledFromMain<
	'AuthenticateMagicLink',
	AuthenticateMagicLinkParameters,
	AuthenticateMagicLinkResponse,
	ModuleDependencies
>('AuthenticateMagicLink', AuthenticateMagicLink)
