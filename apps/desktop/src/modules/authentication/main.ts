import { ipcMain, shell } from 'electron'
import type { BrowserWindow } from 'electron/main'

import { NAME } from './module'

import { SignInWithGoogleGenerator } from './sign_in_with_google'
import { SignInWithGoogleCallbackGenerator } from './sign_in_with_google_callback'

const dependencies = {
	shell
}

const methods = (window: BrowserWindow) => ({
	...SignInWithGoogleGenerator.main({ ipcMain, window, dependencies }),
	...SignInWithGoogleCallbackGenerator.main({ ipcMain, window, dependencies })
})

export { NAME, methods }
