import { createMethodCalledFromMain } from '@modules/factory'
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

export const SignInWithGoogleCallbackGenerator = createMethodCalledFromMain<
	'SignInWithGoogleCallback',
	SignInWithGoogleCallbackParameters,
	SignInWithGoogleCallbackResponse,
	ModuleDependencies
>('SignInWithGoogleCallback', SignInWithGoogleCallback)
