import { createMethodCalledFromMain } from '@modules/factory'
import _ from 'lodash'
import { ModuleDependencies } from '../module'
import { Session } from '@supabase/supabase-js'

type AuthenticationStateChangedParameters = {
	session: Session
}
type AuthenticationStateChangedResponse = {
	error: null
	session: Session
}

const AuthenticationStateChanged = async ({
	parameters: { session },
	dependencies: { supabase }
}: {
	parameters: AuthenticationStateChangedParameters
	dependencies: ModuleDependencies
}): Promise<AuthenticationStateChangedResponse> => {
	return {
		session,
		error: null
	}
}

export const AuthenticationStateChangedGenerator = createMethodCalledFromMain<
	'AuthenticationStateChanged',
	AuthenticationStateChangedParameters,
	AuthenticationStateChangedResponse,
	ModuleDependencies
>('AuthenticationStateChanged', AuthenticationStateChanged)
