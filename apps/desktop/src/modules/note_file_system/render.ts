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
import { OpenNoteSystemMenuGenerator } from './open_note_system_menu'
import { GetFullTreeGenerator } from './get_full_tree'
import { OpenSystemMenuGenerator } from './open_system_menu'
import { RenameNoteGenerator } from './rename_note'
import { RenameFolderGenerator } from './rename_folder'

const methods = () => ({
	...ListNoteFolderGenerator.render(ipcRenderer),
	...ReadNoteGenerator.render(ipcRenderer),
	...SaveNoteGenerator.render(ipcRenderer),
	...CreateFolderGenerator.render(ipcRenderer),
	...DeleteNoteGenerator.render(ipcRenderer),
	...CreateNoteGenerator.render(ipcRenderer),
	...RenameNoteGenerator.render(ipcRenderer),
	...RenameFolderGenerator.render(ipcRenderer),
	...EnsureSystemFoldersGenerator.render(ipcRenderer),
	// ...OpenNoteSystemMenuGenerator.render(ipcRenderer),
	...OpenSystemMenuGenerator.render(ipcRenderer),
	...GetFullTreeGenerator.render(ipcRenderer)
})

export { NAME, methods }
