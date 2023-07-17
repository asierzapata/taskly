import { app } from 'electron'
import * as path from 'path'

import { store } from './store'

console.log('>>>>>>', 'renderer utils')

export const getNotesPath = () => {
	const currentSafePath = store.get('currentSafePath') as string | undefined
	return currentSafePath
		? currentSafePath
		: path.join(app.getPath('userData'), 'notes')
}

export const getPathInNotesFolder = (notePath: string) => {
	return path.join(getNotesPath(), notePath)
}

export const getCleanNotePath = (notePath: string, fileName: string) => {
	return path.join(notePath, fileName)
}

export const getAbsoluteNotePath = (notePath: string, fileName: string) => {
	return path.join(getNotesPath(), notePath, fileName)
}

export const getAbsoluteFolderPath = (
	folderPath: string,
	folderName: string
) => {
	return path.join(getNotesPath(), folderPath, folderName)
}
