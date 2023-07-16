import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type RenameNoteParameters = {
	path: string
	oldName: string
	newName: string
}
type RenameNoteResponse = {
	path: string
	oldName: string
	newName: string
}

export const RenameNote = async ({
	parameters: { path, oldName, newName },
	dependencies
}: {
	parameters: RenameNoteParameters
	dependencies: ModuleDependencies
}): Promise<RenameNoteResponse> => {
	const oldPath = dependencies.notesPath.getCleanNotePath(
		dependencies.notesPath.getPathInNotesFolder(path),
		oldName
	)

	const newPath = dependencies.notesPath.getCleanNotePath(
		dependencies.notesPath.getPathInNotesFolder(path),
		newName
	)

	await dependencies.fs.rename(oldPath, newPath)

	return {
		path,
		oldName,
		newName
	}
}

export const RenameNoteGenerator = createCommand<
	'RenameNote',
	RenameNoteParameters,
	RenameNoteResponse,
	ModuleDependencies
>('RenameNote', RenameNote)
