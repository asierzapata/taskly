import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type RenameFolderParameters = {
	oldPath: string
	newPath: string
}
type RenameFolderResponse = void

export const RenameFolder = async ({
	parameters: { oldPath, newPath },
	dependencies
}: {
	parameters: RenameFolderParameters
	dependencies: ModuleDependencies
}): Promise<RenameFolderResponse> => {
	const absoluteOldPath = dependencies.notesPath.getPathInNotesFolder(oldPath)
	const absoluteNewPath = dependencies.notesPath.getPathInNotesFolder(newPath)

	await dependencies.fs.rename(absoluteOldPath, absoluteNewPath)

	return
}

export const RenameFolderGenerator = createCommand<
	'RenameFolder',
	RenameFolderParameters,
	RenameFolderResponse,
	ModuleDependencies
>('RenameFolder', RenameFolder)
