import { createMethodCalledFromMain } from '@modules/factory'
import _ from 'lodash'
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

	await dependencies.fs.mkdir(dependencies.notesPath.getNotesPath())
}

export const EnsureSystemFoldersGenerator = createMethodCalledFromMain<
	'EnsureSystemFolders',
	EnsureSystemFoldersParameters,
	EnsureSystemFoldersResponse,
	ModuleDependencies
>('EnsureSystemFolders', EnsureSystemFolders)
