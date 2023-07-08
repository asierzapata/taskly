// Add here other modules
import * as AuthenticationModule from '@modules/authentication/render'
import * as NoteFileSystemModule from '@modules/note_file_system/render'

export const API = {
	[AuthenticationModule.NAME]: AuthenticationModule.methods(),
	[NoteFileSystemModule.NAME]: NoteFileSystemModule.methods()
}
