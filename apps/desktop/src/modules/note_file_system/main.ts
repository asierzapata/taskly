import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron/main'

import {
	readFile,
	writeFile,
	readdir,
	stat,
	mkdir,
	rm,
	rename
} from 'fs/promises'

import { NAME } from './module'
import { ListNoteFolderGenerator } from './list_note_folder'
import { ReadNoteGenerator } from './read_note'
import { SaveNoteGenerator } from './save_note'
import { getCleanNotePath, getNotesPath, getPathInNotesFolder } from './utils'
import { CreateFolderGenerator } from './create_folder'
import { CreateNoteGenerator } from './create_note'
import { EnsureSystemFoldersGenerator } from './ensure_system_folders'
import { DeleteNoteGenerator } from './delete_note'
import { OpenNoteSystemMenuGenerator } from './open_note_system_menu'
import { GetFullTreeGenerator } from './get_full_tree'
import { OpenSystemMenuGenerator } from './open_system_menu'
import { RenameNoteGenerator } from './rename_note'
import { RenameFolderGenerator } from './rename_folder'

const dependencies = {
	fs: {
		readFile,
		writeFile,
		readdir,
		stat,
		mkdir,
		rm,
		rename
	},
	notesPath: {
		getNotesPath,
		getPathInNotesFolder,
		getCleanNotePath
	}
}

const methods = (window: BrowserWindow) => ({
	...ListNoteFolderGenerator.main(ipcMain, dependencies),
	...ReadNoteGenerator.main(ipcMain, dependencies),
	...SaveNoteGenerator.main(ipcMain, dependencies),
	...CreateNoteGenerator.main(ipcMain, dependencies),
	...DeleteNoteGenerator.main(ipcMain, dependencies),
	...RenameNoteGenerator.main(ipcMain, dependencies),
	...RenameFolderGenerator.main(ipcMain, dependencies),
	...CreateFolderGenerator.main(ipcMain, dependencies),
	// ...OpenNoteSystemMenuGenerator.main(ipcMain, dependencies),
	...OpenSystemMenuGenerator.main(ipcMain, dependencies),
	...GetFullTreeGenerator.main(ipcMain, dependencies),
	...EnsureSystemFoldersGenerator.main(window, dependencies)
})

export { NAME, methods }
