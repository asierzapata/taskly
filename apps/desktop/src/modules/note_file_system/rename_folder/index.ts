import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type RenameFolderParameters = {
	path: string
	oldName: string
	newName: string
}
type RenameFolderResponse = {
	path: string
	oldName: string
	newName: string
}

export const RenameFolder = async ({
	parameters: { path, oldName, newName },
	dependencies
}: {
	parameters: RenameFolderParameters
	dependencies: ModuleDependencies
}): Promise<RenameFolderResponse> => {
	const absoluteOldPath = dependencies.notesPath.getAbsoluteFolderPath(
		path,
		oldName
	)
	const absoluteNewPath = dependencies.notesPath.getAbsoluteFolderPath(
		path,
		newName
	)

	await dependencies.fs.rename(absoluteOldPath, absoluteNewPath)

	return {
		path,
		oldName,
		newName
	}
}

export const RenameFolderGenerator = createCommand<
	'RenameFolder',
	RenameFolderParameters,
	RenameFolderResponse,
	ModuleDependencies
>('RenameFolder', RenameFolder)
