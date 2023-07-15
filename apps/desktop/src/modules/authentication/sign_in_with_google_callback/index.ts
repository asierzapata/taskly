import { createCommand } from '@modules/factory'
import _ from 'lodash'
import { ModuleDependencies } from '../module'

type SignInWithGoogleCallbackParameters = {
	code: string
}
type SignInWithGoogleCallbackResponse = {
	code: string
}

const SignInWithGoogleCallback = async ({
	parameters: { code },
	dependencies
}: {
	parameters: SignInWithGoogleCallbackParameters
	dependencies: ModuleDependencies
}): Promise<SignInWithGoogleCallbackResponse> => {
	return {
		code
	}
}

// TODO: Refactor this to be an event
export const SignInWithGoogleCallbackGenerator = createCommand<
	'SignInWithGoogleCallback',
	SignInWithGoogleCallbackParameters,
	SignInWithGoogleCallbackResponse,
	ModuleDependencies
>('SignInWithGoogleCallback', SignInWithGoogleCallback)
