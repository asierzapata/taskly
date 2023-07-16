import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type UpdateNoteFileSystemPathParameters = {
	newPath: string
}
type UpdateNoteFileSystemPathResponse = {
	newPath: string
}

export const UpdateNoteFileSystemPath = async ({
	parameters: { newPath },
	dependencies
}: {
	parameters: UpdateNoteFileSystemPathParameters
	dependencies: ModuleDependencies
}): Promise<UpdateNoteFileSystemPathResponse> => {
	dependencies.store.set('currentSafePath', newPath)

	return { newPath }
}

export const UpdateNoteFileSystemPathGenerator = createCommand<
	'UpdateNoteFileSystemPath',
	UpdateNoteFileSystemPathParameters,
	UpdateNoteFileSystemPathResponse,
	ModuleDependencies
>('UpdateNoteFileSystemPath', UpdateNoteFileSystemPath)
