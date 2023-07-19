import { createCommand } from '@modules/factory'
import _ from 'lodash'
import { type ModuleDependencies } from '../module'
import { shell } from 'electron'

type SignInWithGoogleParameters = void
type SignInWithGoogleResponse = void

const SignInWithGoogle = async ({
	dependencies
}: {
	dependencies: ModuleDependencies
}): Promise<SignInWithGoogleResponse> => {
	// TODO: Change redirect to correct domain
	dependencies.shell.openExternal(
		'https://accounts.google.com/o/oauth2/v2/auth?client_id=849674951165-bgplmtbb38oma3jlavkdj12db59bdvgb.apps.googleusercontent.com&redirect_uri=http://localhost:3001/auth/google_callback&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile'
	)

	return
}

export const SignInWithGoogleGenerator = createCommand<
	'SignInWithGoogle',
	SignInWithGoogleParameters,
	SignInWithGoogleResponse,
	ModuleDependencies
>('SignInWithGoogle', SignInWithGoogle)
