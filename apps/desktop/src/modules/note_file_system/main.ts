import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron/main'

import { readFile, writeFile, readdir, stat, mkdir, rm } from 'fs/promises'

import { NAME } from './module'
import { ListNoteFolderGenerator } from './list_note_folder'
import { ReadNoteGenerator } from './read_note'
import { SaveNoteGenerator } from './save_note'
import { getCleanNotePath, getNotesPath, getPathInNotesFolder } from './utils'
import { CreateFolderGenerator } from './create_folder'
import { CreateNoteGenerator } from './create_note'
import { EnsureSystemFoldersGenerator } from './ensure_system_folders'
import { DeleteNoteGenerator } from './delete_note'

const dependencies = {
	fs: {
		readFile,
		writeFile,
		readdir,
		stat,
		mkdir,
		rm
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
	...CreateFolderGenerator.main(ipcMain, dependencies),
	...EnsureSystemFoldersGenerator.main(window, dependencies)
})

export { NAME, methods }
