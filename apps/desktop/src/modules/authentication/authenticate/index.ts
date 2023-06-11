import { createMethodCalledFromRender } from '@modules/factory'
import { deepLinks } from '@services/deep_links'
import _ from 'lodash'
import { ModuleDependencies } from '../module'

type AuthenticateParameters = { email: string }
type AuthenticateResponse = { error?: string }

const Authenticate = async ({
	parameters: { email },
	dependencies: { supabase }
}: {
	parameters: AuthenticateParameters
	dependencies: ModuleDependencies
}): Promise<AuthenticateResponse> => {
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: deepLinks.magicLinkCallback.url
		}
	})

	return { error: error?.message }
}

export const AuthenticateGenerator = createMethodCalledFromRender<
	'Authenticate',
	AuthenticateParameters,
	AuthenticateResponse,
	ModuleDependencies
>('Authenticate', Authenticate)
