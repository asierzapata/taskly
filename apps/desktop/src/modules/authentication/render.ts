/**
 * This file contains all the definitions that will be exposed
 * to the render process.
 */
import type { IpcRenderer } from 'electron'

import { NAME } from './module'

import { SignInWithGoogleGenerator } from './sign_in_with_google'
import { SignInWithGoogleCallbackGenerator } from './sign_in_with_google_callback'

const methods = ({ ipcRenderer }: { ipcRenderer: IpcRenderer }) => ({
	...SignInWithGoogleGenerator.render(ipcRenderer),
	...SignInWithGoogleCallbackGenerator.render(ipcRenderer)
})

export { NAME, methods }
