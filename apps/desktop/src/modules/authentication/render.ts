/**
 * This file contains all the definitions that will be exposed
 * to the render process.
 */
import { ipcRenderer } from 'electron'

import { NAME } from './module'

import { SignInWithGoogleGenerator } from './sign_in_with_google'
import { SignInWithGoogleCallbackGenerator } from './sign_in_with_google_callback'

const methods = () => ({
	...SignInWithGoogleGenerator.render(ipcRenderer),
	...SignInWithGoogleCallbackGenerator.render(ipcRenderer)
})

export { NAME, methods }
