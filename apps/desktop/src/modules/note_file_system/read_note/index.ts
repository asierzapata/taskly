import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'

type ReadNoteParameters = {
	path: string
}
type ReadNoteResponse = {
	content: string
}

export const ReadNote = async ({
	parameters: { path },
	dependencies
}: {
	parameters: ReadNoteParameters
	dependencies: ModuleDependencies
}): Promise<ReadNoteResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isFile()) {
		throw new Error('Path is not a file')
	}

	const content = await dependencies.fs.readFile(absolutePath, {
		encoding: 'utf-8'
	})

	return {
		content
	}
}

export const ReadNoteGenerator = createMethodCalledFromRender<
	'ReadNote',
	ReadNoteParameters,
	ReadNoteResponse,
	ModuleDependencies
>('ReadNote', ReadNote)
