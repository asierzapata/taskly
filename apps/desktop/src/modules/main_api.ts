import * as AuthenticationModule from '@modules/authentication/main'
import { BrowserWindow } from 'electron'

export const API = (window: BrowserWindow) => ({
	[AuthenticationModule.NAME]: AuthenticationModule.methods(window)
})

export type MainApi = ReturnType<typeof API>
