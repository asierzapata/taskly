import type fs from 'fs/promises'

// Module Name
export const NAME = 'noteFileSystem' as const

export type ModuleDependencies = {
	fs: {
		readFile: typeof fs.readFile
		writeFile: typeof fs.writeFile
		readdir: typeof fs.readdir
		stat: typeof fs.stat
		mkdir: typeof fs.mkdir
		rm: typeof fs.rm
		rename: typeof fs.rename
	}
	notesPath: {
		getNotesPath: () => string
		getPathInNotesFolder: (path: string) => string
		getCleanNotePath: (notePath: string, noteName: string) => string
		getAbsoluteNotePath: (notePath: string, noteName: string) => string
		getAbsoluteFolderPath: (folderPath: string, folderName: string) => string
	}
}
