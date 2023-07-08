import { app } from 'electron'
import * as path from 'path'

export const getNotesPath = () => {
	return path.join(app.getPath('userData'), 'notes')
}

export const getPathInNotesFolder = (notePath: string) => {
	return path.join(getNotesPath(), notePath)
}

export const getCleanNotePath = (notePath: string, fileName: string) => {
	return path.join(notePath, fileName)
}
