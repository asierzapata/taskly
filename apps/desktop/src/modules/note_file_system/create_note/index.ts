import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'

type CreateNoteParameters = {
	path: string
}
type CreateNoteResponse = void

export const CreateNote = async ({
	parameters: { path },
	dependencies
}: {
	parameters: CreateNoteParameters
	dependencies: ModuleDependencies
}): Promise<CreateNoteResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	await dependencies.fs.writeFile(absolutePath, 'Untitled', {
		encoding: 'utf-8'
	})

	return
}

export const CreateNoteGenerator = createMethodCalledFromRender<
	'CreateNote',
	CreateNoteParameters,
	CreateNoteResponse,
	ModuleDependencies
>('CreateNote', CreateNote)
