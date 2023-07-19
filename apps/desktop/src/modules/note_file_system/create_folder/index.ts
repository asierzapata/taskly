import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type CreateFolderParameters = {
	path: string
	name: string
}
type CreateFolderResponse = {
	path: string
	name: string
}

export const CreateFolder = async ({
	parameters: { path, name },
	dependencies
}: {
	parameters: CreateFolderParameters
	dependencies: ModuleDependencies
}): Promise<CreateFolderResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteFolderPath(path, name)

	console.log('>>>>>>', absolutePath)

	await dependencies.fs.mkdir(absolutePath)

	return { path, name }
}

export const CreateFolderGenerator = createCommand<
	'CreateFolder',
	CreateFolderParameters,
	CreateFolderResponse,
	ModuleDependencies
>('CreateFolder', CreateFolder)
