import { deepLinks } from '@/deep_links'
import type { Supabase } from '@/supabase'
import { createMethodCalledFromRender } from '@modules/factory'
import _ from 'lodash'

type AuthenticateParameters = { email: string }
type AuthenticateResponse = { error?: string }
type AuthenticateDependencies = { supabase: Supabase }

const Authenticate = async (
	_event: Electron.IpcMainInvokeEvent,
	payload: AuthenticateParameters,
	dependencies: AuthenticateDependencies
): Promise<AuthenticateResponse> => {
	const { error } = await dependencies.supabase.auth.signInWithOtp({
		email: payload.email,
		options: {
			emailRedirectTo: deepLinks.loginCallback.url
		}
	})

	return { error: error.message }
}

export const AuthenticateGenerator = createMethodCalledFromRender<
	'Authenticate',
	AuthenticateParameters,
	AuthenticateResponse,
	AuthenticateDependencies
>('Authenticate', Authenticate)
