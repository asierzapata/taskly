import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'

type CreateFolderParameters = {
	path: string
}
type CreateFolderResponse = void

export const CreateFolder = async ({
	parameters: { path },
	dependencies
}: {
	parameters: CreateFolderParameters
	dependencies: ModuleDependencies
}): Promise<CreateFolderResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	await dependencies.fs.mkdir(absolutePath)

	return
}

export const CreateFolderGenerator = createMethodCalledFromRender<
	'CreateFolder',
	CreateFolderParameters,
	CreateFolderResponse,
	ModuleDependencies
>('CreateFolder', CreateFolder)
