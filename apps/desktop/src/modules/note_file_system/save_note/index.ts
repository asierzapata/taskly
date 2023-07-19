import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type SaveNoteParameters = {
	path: string
	content: string
}
type SaveNoteResponse = void

export const SaveNote = async ({
	parameters: { path, content },
	dependencies
}: {
	parameters: SaveNoteParameters
	dependencies: ModuleDependencies
}): Promise<SaveNoteResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	await dependencies.fs.writeFile(absolutePath, content, {
		encoding: 'utf-8'
	})

	return
}

export const SaveNoteGenerator = createCommand<
	'SaveNote',
	SaveNoteParameters,
	SaveNoteResponse,
	ModuleDependencies
>('SaveNote', SaveNote)
