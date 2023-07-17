import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type EnsureSystemFoldersParameters = void
type EnsureSystemFoldersResponse = void

const EnsureSystemFolders = async ({
	dependencies
}: {
	parameters: EnsureSystemFoldersParameters
	dependencies: ModuleDependencies
}): Promise<EnsureSystemFoldersResponse> => {
	// We need to ensure that the following folders exist:
	// - notes

	const stats = await dependencies.fs.stat(
		dependencies.notesPath.getNotesPath()
	)

	if (!stats.isDirectory()) {
		await dependencies.fs.mkdir(dependencies.notesPath.getNotesPath())
	}
}

export const EnsureSystemFoldersGenerator = createCommand<
	'EnsureSystemFolders',
	EnsureSystemFoldersParameters,
	EnsureSystemFoldersResponse,
	ModuleDependencies
>('EnsureSystemFolders', EnsureSystemFolders)
