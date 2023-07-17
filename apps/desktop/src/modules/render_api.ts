// Add here other modules
import * as AuthenticationModule from '@modules/authentication/render'
import * as NoteFileSystemModule from '@modules/note_file_system/render'
import type { IpcRenderer } from 'electron'

export const API = ({ ipcRenderer }: { ipcRenderer: IpcRenderer }) => ({
	[AuthenticationModule.NAME]: AuthenticationModule.methods({
		ipcRenderer
	}),
	[NoteFileSystemModule.NAME]: NoteFileSystemModule.methods({
		ipcRenderer
	})
})
