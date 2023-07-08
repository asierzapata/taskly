/**
 * This file contains all the definitions that will be exposed
 * to the render process.
 */
import { ipcRenderer } from 'electron'

import { NAME } from './module'
import { ListNoteFolderGenerator } from './list_note_folder'
import { SaveNoteGenerator } from './save_note'
import { ReadNoteGenerator } from './read_note'
import { CreateFolderGenerator } from './create_folder'
import { CreateNoteGenerator } from './create_note'
import { EnsureSystemFoldersGenerator } from './ensure_system_folders'
import { DeleteNoteGenerator } from './delete_note'

const methods = () => ({
	...ListNoteFolderGenerator.render(ipcRenderer),
	...ReadNoteGenerator.render(ipcRenderer),
	...SaveNoteGenerator.render(ipcRenderer),
	...CreateFolderGenerator.render(ipcRenderer),
	...DeleteNoteGenerator.render(ipcRenderer),
	...CreateNoteGenerator.render(ipcRenderer),
	...EnsureSystemFoldersGenerator.render(ipcRenderer)
})

export { NAME, methods }
