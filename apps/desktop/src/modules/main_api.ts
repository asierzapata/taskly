import { type BrowserWindow } from 'electron'

import * as AuthenticationModule from '@modules/authentication/main'
import * as NoteFileSystemModule from '@modules/note_file_system/main'

export const API = (window: BrowserWindow) => ({
	[AuthenticationModule.NAME]: AuthenticationModule.methods(window),
	[NoteFileSystemModule.NAME]: NoteFileSystemModule.methods(window)
})

export type MainApi = ReturnType<typeof API>
