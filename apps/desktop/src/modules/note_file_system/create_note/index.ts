import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type CreateNoteParameters = {
	path: string
	name: string
}
type CreateNoteResponse = {
	path: string
	name: string
}

export const CreateNote = async ({
	parameters: { path, name },
	dependencies
}: {
	parameters: CreateNoteParameters
	dependencies: ModuleDependencies
}): Promise<CreateNoteResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteNotePath(path, name)

	await dependencies.fs.writeFile(absolutePath, '', {
		encoding: 'utf-8'
	})

	return {
		path,
		name
	}
}

export const CreateNoteGenerator = createCommand<
	'CreateNote',
	CreateNoteParameters,
	CreateNoteResponse,
	ModuleDependencies
>('CreateNote', CreateNote)
