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

import {
	getCleanNotePath,
	getNotesPath,
	getPathInNotesFolder,
	getAbsoluteNotePath,
	getAbsoluteFolderPath
} from './utils'
import { store } from './utils/store'

import { ListNoteFolderGenerator } from './list_note_folder'
import { ReadNoteGenerator } from './read_note'
import { SaveNoteGenerator } from './save_note'
import { CreateFolderGenerator } from './create_folder'
import { CreateNoteGenerator } from './create_note'
import { EnsureSystemFoldersGenerator } from './ensure_system_folders'
import { DeleteNoteGenerator } from './delete_note'
import { GetFullTreeGenerator } from './get_full_tree'
import { RenameNoteGenerator } from './rename_note'
import { RenameFolderGenerator } from './rename_folder'
import { DeleteFolderGenerator } from './delete_folder'
import { UpdateNoteFileSystemPathGenerator } from './update_note_file_system_path'
import { WriteNoteGenerator } from './write_note'

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
		getCleanNotePath,
		getAbsoluteNotePath,
		getAbsoluteFolderPath
	},
	store
}

const methods = (window: BrowserWindow) => ({
	...ListNoteFolderGenerator.main({ ipcMain, window, dependencies }),
	...ReadNoteGenerator.main({ ipcMain, window, dependencies }),
	...WriteNoteGenerator.main({ ipcMain, window, dependencies }),
	...SaveNoteGenerator.main({ ipcMain, window, dependencies }),
	...CreateNoteGenerator.main({ ipcMain, window, dependencies }),
	...DeleteNoteGenerator.main({ ipcMain, window, dependencies }),
	...DeleteFolderGenerator.main({ ipcMain, window, dependencies }),
	...RenameNoteGenerator.main({ ipcMain, window, dependencies }),
	...RenameFolderGenerator.main({ ipcMain, window, dependencies }),
	...CreateFolderGenerator.main({ ipcMain, window, dependencies }),
	...GetFullTreeGenerator.main({ ipcMain, window, dependencies }),
	...EnsureSystemFoldersGenerator.main({ ipcMain, window, dependencies }),
	...UpdateNoteFileSystemPathGenerator.main({ ipcMain, window, dependencies })
})

export { NAME, methods }
