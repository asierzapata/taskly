import { createMethodCalledFromRender } from '@modules/factory'
import _ from 'lodash'
import { ModuleDependencies } from '../module'
import { Session } from '@supabase/supabase-js'

type GetSessionParameters = void
type GetSessionResponse =
	| {
			error: null
			session: Session
	  }
	| {
			error: string
			session: null
	  }

const GetSession = async ({
	dependencies: { supabase }
}: {
	dependencies: ModuleDependencies
}): Promise<GetSessionResponse> => {
	const { data, error } = await supabase.auth.getSession()

	if (error) {
		return {
			error: error.message,
			session: null
		}
	}

	return {
		error: null,
		session: data.session
	}
}

export const GetSessionGenerator = createMethodCalledFromRender<
	'GetSession',
	GetSessionParameters,
	GetSessionResponse,
	ModuleDependencies
>('GetSession', GetSession)
